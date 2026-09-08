<#
.SYNOPSIS
    Export every Word note in active-word-notes/ to a PDF in resources/.

.DESCRIPTION
    Word is the editing format; PDF is the published format. Authors keep working
    in active-word-notes/, and this script is the only thing that puts a document
    into resources/ - which is the tree tools/sync-resources.mjs uploads to the
    LMS. Nothing in resources/ is meant to be edited by hand.

    The destination mirrors the source path, so a file's week and category folder
    survive the conversion and sync-resources can still read them off the path:

        active-word-notes/week-05/notes/week-05-php-master-guide.docx
        resources/week-05/notes/week-05-php-master-guide.pdf

    Conversion goes through the installed Word (COM), not a third-party renderer,
    because these documents rely on Word features a generic converter drops: the
    branded header, the "Page X of Y" footer fields and the table of contents.
    Fields are refreshed before export so page numbers in the TOC match the PDF
    rather than showing whatever was cached when the document was last saved.

.PARAMETER Force
    Re-export even when the PDF is already newer than its .docx. Use it after
    changing the house style, when the documents themselves have not changed.

.PARAMETER Only
    Convert just the files whose path contains this text, e.g. -Only week-05.

.EXAMPLE
    pwsh -File tools/docx-to-pdf.ps1
    pwsh -File tools/docx-to-pdf.ps1 -Only week-05 -Force

.NOTES
    Windows with Microsoft Word only. Run it before `npm run resources:sync`.
#>

[CmdletBinding()]
param(
    [switch]$Force,
    [string]$Only
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $repoRoot 'active-word-notes'
$targetRoot = Join-Path $repoRoot 'resources'

if (-not (Test-Path $sourceRoot)) {
    throw "No active-word-notes folder at $sourceRoot."
}

$documents = Get-ChildItem -Path $sourceRoot -Recurse -File -Include '*.docx', '*.doc' |
    Where-Object { $_.Name -notlike '~$*' } |   # Word's lock files for open documents
    Sort-Object FullName

if ($Only) {
    $documents = $documents | Where-Object { $_.FullName -like "*$Only*" }
}

if (-not $documents) {
    Write-Host "`n  Nothing to convert.`n"
    return
}

# Word constants, spelled out because the COM object exposes them as bare ints.
$wdExportFormatPDF = 17
$wdExportOptimizeForPrint = 0
$wdExportAllDocument = 0
$wdExportDocumentWithMarkup = 7   # 7 = document content only, no tracked-change balloons
$wdExportCreateHeadingBookmarks = 1
$wdAlertsNone = 0
$wdDoNotSaveChanges = 0

Write-Host "`nConverting $($documents.Count) document(s) to PDF`n"

$word = $null
$converted = 0
$skipped = 0
$failed = @()

try {
    try {
        $word = New-Object -ComObject Word.Application
    }
    catch {
        throw "Microsoft Word is required to convert these documents, and it could not be started. ($($_.Exception.Message))"
    }

    $word.Visible = $false
    $word.DisplayAlerts = $wdAlertsNone
    # Never let a document's own links repaginate against files that are not here.
    $word.Options.UpdateLinksAtOpen = $false

    foreach ($document in $documents) {
        $relative = $document.FullName.Substring($sourceRoot.Length).TrimStart('\', '/')
        $pdfPath = Join-Path $targetRoot ([IO.Path]::ChangeExtension($relative, 'pdf'))

        if (-not $Force -and (Test-Path $pdfPath) -and
            (Get-Item $pdfPath).LastWriteTime -ge $document.LastWriteTime) {
            Write-Host "  SKIP  $relative (PDF is up to date)"
            $skipped += 1
            continue
        }

        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $pdfPath) | Out-Null

        $opened = $null
        try {
            $opened = $word.Documents.Open(
                $document.FullName,
                [ref]$false,   # ConfirmConversions
                [ref]$true,    # ReadOnly - the source is never modified by converting
                [ref]$false)   # AddToRecentFiles

            # Refresh the header/footer "Page X of Y" fields and the table of
            # contents, so the PDF's page numbers describe the PDF.
            $opened.Fields.Update() | Out-Null
            foreach ($toc in $opened.TablesOfContents) { $toc.Update() }

            $opened.ExportAsFixedFormat(
                $pdfPath,
                $wdExportFormatPDF,
                $false,                            # OpenAfterExport
                $wdExportOptimizeForPrint,
                $wdExportAllDocument,
                1, 1,
                $wdExportDocumentWithMarkup,
                $false,                            # IncludeDocProps
                $true,                             # KeepIRM
                $wdExportCreateHeadingBookmarks,   # a navigable outline in the PDF
                $true,                             # DocStructureTags - keeps it accessible
                $true,                             # BitmapMissingFonts
                $false)                            # UseISO19005_1

            $size = '{0:N0} KB' -f ((Get-Item $pdfPath).Length / 1KB)
            Write-Host "  OK    $([IO.Path]::ChangeExtension($relative, 'pdf'))  ($size)"
            $converted += 1
        }
        catch {
            Write-Host "  FAIL  $relative - $($_.Exception.Message)"
            $failed += $relative
        }
        finally {
            if ($opened) { $opened.Close([ref]$wdDoNotSaveChanges) | Out-Null }
        }
    }
}
finally {
    if ($word) {
        $word.Quit()
        [Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    }
}

Write-Host "`n  Done. $converted converted, $skipped already current, $($failed.Count) failed.`n"

if ($failed.Count -gt 0) {
    Write-Host "  Failed:`n$($failed | ForEach-Object { "    $_`n" })"
    exit 1
}
