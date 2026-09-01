import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEO from "@/components/common/SEO";
import { routes } from "@/routes/routeConfig";

const EditorialPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <SEO
        title="Editorial Policy | Tech Pulse Insider"
        description="Understand Tech Pulse Insider editorial standards, fact-checking practices, and content responsibility guidelines."
        canonicalPath={routes.public.editorialPolicy}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Editorial Policy & Disclaimer
          </h1>
          <p className="text-muted-foreground">
            Last Updated: January 26, 2026
          </p>
        </div>

        {/* Mission Alert */}
        <Alert className="mb-8 border-blue-600/30 bg-blue-50 dark:bg-blue-900/20">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Tech Pulse Insider is committed to delivering accurate, insightful, and trustworthy tech journalism that empowers individuals and organizations across Africa.
          </AlertDescription>
        </Alert>

        {/* Content */}
        <div className="space-y-8">
          {/* 1. Our Mission & Values */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">1. Our Mission & Core Values</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Mission</h3>
                <p className="text-foreground">
                  Tech Pulse Insider is an independent tech media initiative dedicated to bridging the digital divide in Kenya and across Africa. We provide timely, accurate, and contextually relevant tech news, insights, and educational content that helps individuals and organizations understand, adopt, and leverage technology for growth and development.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Core Values</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li><strong>Accuracy:</strong> We verify facts and sources before publication</li>
                  <li><strong>Integrity:</strong> We maintain editorial independence and transparency</li>
                  <li><strong>Inclusivity:</strong> We represent diverse perspectives and communities</li>
                  <li><strong>Accountability:</strong> We correct errors and explain our editorial decisions</li>
                  <li><strong>Excellence:</strong> We strive for the highest standards of journalism</li>
                  <li><strong>Impact:</strong> We aim to create positive change through informed reporting</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 2. Content Standards & Accuracy */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">2. Content Standards & Accuracy</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">2.1 Verification & Sourcing</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>We verify information through multiple credible sources before publication</li>
                  <li>We cite sources and provide attribution whenever possible</li>
                  <li>We distinguish between reported facts and expert analysis</li>
                  <li>We use official statements, press releases, and primary sources</li>
                  <li>We conduct interviews with relevant stakeholders and experts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">2.2 Distinction Between News & Opinion</h3>
                <p className="text-foreground mb-2">
                  Tech Pulse Insider publishes both factual reporting and opinion/analysis content. We clearly label content as:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li><strong>News:</strong> Factual reporting based on verified information</li>
                  <li><strong>Analysis:</strong> Interpretation and expert commentary on events</li>
                  <li><strong>Opinion/Column:</strong> Personal viewpoints clearly attributed to the author</li>
                  <li><strong>Sponsored Content:</strong> Content produced on behalf of paying clients (clearly marked)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">2.3 Corrections & Clarifications</h3>
                <p className="text-foreground">
                  If we publish inaccurate information, we promptly issue corrections or clarifications. Corrections are clearly noted with the date, and we maintain a corrections log. We welcome reader feedback and corrections.
                </p>
              </div>
            </div>
          </Card>

          {/* 3. Conflict of Interest & Independence */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">3. Conflict of Interest & Editorial Independence</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">3.1 Financial Independence</h3>
                <p className="text-foreground">
                  Tech Pulse Insider maintains editorial independence from financial interests. We clearly disclose revenue sources, including sponsorships, advertising, and partnerships. Advertising does not influence editorial decisions.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">3.2 Personal Conflicts</h3>
                <p className="text-foreground mb-2">
                  Our journalists and editorial team:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>Disclose personal, financial, or professional conflicts of interest</li>
                  <li>Recuse themselves from covering stories where conflicts exist</li>
                  <li>Do not accept gifts, favors, or benefits from sources</li>
                  <li>Avoid personal investment in companies they cover</li>
                  <li>Maintain professional relationships without compromising objectivity</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">3.3 Source Protection</h3>
                <p className="text-foreground">
                  We protect the confidentiality of anonymous sources when necessary to serve the public interest. We use multiple sources for sensitive information and only grant anonymity when sources are unable to speak on the record without retaliation.
                </p>
              </div>
            </div>
          </Card>

          {/* 4. Sponsorship & Advertising Transparency */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">4. Sponsorship & Advertising Transparency</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">4.1 Sponsored Content</h3>
                <p className="text-foreground mb-2">
                  Sponsored content, branded articles, and native advertising are clearly marked with labels such as:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>"Sponsored"</li>
                  <li>"Brand Partnership"</li>
                  <li>"Paid Content"</li>
                  <li>"Promoted"</li>
                </ul>
                <p className="text-foreground mt-2">
                  Sponsored content is visually distinct from editorial content and does not influence our news judgment.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">4.2 Advertiser Relations</h3>
                <p className="text-foreground">
                  Advertising placement does not determine editorial coverage. We maintain a strict separation between advertising and editorial teams. Advertisers do not have editorial input, and editorial decisions are made independently.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">4.3 Affiliate Links</h3>
                <p className="text-foreground">
                  When we include affiliate links (for products or services we may earn commission from), we clearly disclose this relationship. Such links do not influence our product recommendations or reviews.
                </p>
              </div>
            </div>
          </Card>

          {/* 5. Comments & User-Generated Content */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">5. Comments & User-Generated Content Moderation</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">5.1 Community Standards</h3>
                <p className="text-foreground mb-2">
                  We encourage respectful comments and user engagement. However, we remove or moderate comments that:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>Contain hate speech, discrimination, or harassment</li>
                  <li>Are defamatory, libelous, or violate privacy</li>
                  <li>Contain spam, advertising, or inappropriate links</li>
                  <li>Are factually misleading or spread misinformation</li>
                  <li>Violate applicable laws</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">5.2 Comment Moderation</h3>
                <p className="text-foreground">
                  We may moderate comments before publication or remove them after publication. Moderation is conducted fairly and transparently. Users who repeatedly violate community standards may be banned.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">5.3 User Content Ownership</h3>
                <p className="text-foreground">
                  You retain ownership of user-generated content you submit. By posting, you grant Tech Pulse Insider a license to use, reproduce, and distribute your content. Your content may be edited for clarity, grammar, or policy compliance.
                </p>
              </div>
            </div>
          </Card>

          {/* 6. Privacy in Reporting */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">6. Privacy, Safety & Responsible Reporting</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">6.1 Protecting Privacy</h3>
                <p className="text-foreground mb-2">
                  We respect individual privacy and:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>Do not publish private information without consent (except matters of public interest)</li>
                  <li>Minimize identification of victims of sensitive crimes</li>
                  <li>Protect the identity of vulnerable sources (minors, abuse victims, etc.)</li>
                  <li>Respect embargoes and off-the-record agreements</li>
                  <li>Secure personal information and avoid unnecessary data collection</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">6.2 Responsible Coverage of Sensitive Topics</h3>
                <p className="text-foreground mb-2">
                  When reporting on sensitive issues (violence, mental health, self-harm, terrorism), we:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>Minimize potentially harmful details</li>
                  <li>Provide context and background information</li>
                  <li>Include resources and support information when appropriate</li>
                  <li>Avoid sensationalism or exploitation</li>
                  <li>Consider the impact on vulnerable communities</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 7. Fact-Checking & Combating Misinformation */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">7. Fact-Checking & Combating Misinformation</h2>
            
            <p className="text-foreground mb-4">
              Tech Pulse Insider is committed to combating misinformation and disinformation:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li>We verify viral claims and debunk false narratives</li>
              <li>We provide fact-checks and clarifications on misleading content</li>
              <li>We distinguish between opinion, speculation, and verified facts</li>
              <li>We update stories with new information as situations develop</li>
              <li>We acknowledge uncertainty and avoid false balance on settled science/facts</li>
              <li>We do not amplify unverified misinformation without context</li>
            </ul>
          </Card>

          {/* 8. Digital Media Responsibility */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">8. Digital Media Responsibility</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">8.1 Content Integrity</h3>
                <p className="text-foreground mb-2">
                  We maintain the integrity of digital content:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>We use authentic images and videos; doctored media is clearly labeled</li>
                  <li>We include image credits and source attribution</li>
                  <li>We disclose when content has been edited or updated</li>
                  <li>We do not manipulate images or videos to misrepresent reality</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">8.2 Algorithmic Transparency</h3>
                <p className="text-foreground">
                  Our recommendation algorithms prioritize accuracy, diversity, and user interests over engagement metrics. We do not artificially boost false or misleading content for clicks.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">8.3 Social Media Conduct</h3>
                <p className="text-foreground">
                  Our journalists maintain professional standards on social media. Personal social accounts should not be confused with editorial voices. Staff may not abuse their platform for partisan purposes.
                </p>
              </div>
            </div>
          </Card>

          {/* 9. Disclaimer of Content Liability */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Content Liability</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">9.1 Educational & Informational Purpose</h3>
                <p className="text-foreground">
                  Tech Pulse Insider provides information for educational and informational purposes only. Our content is not professional advice (legal, financial, medical, etc.). Always consult qualified professionals for specific advice.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">9.2 No Guarantee of Accuracy</h3>
                <p className="text-foreground">
                  While we strive for accuracy, we do not guarantee that all information is complete, accurate, or up-to-date. Technology and business landscapes evolve rapidly, and information may become outdated.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">9.3 Third-Party Content</h3>
                <p className="text-foreground">
                  We may republish or link to third-party content. We are not responsible for the accuracy, legality, or quality of third-party material. Links do not constitute endorsement.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">9.4 Product & Service Reviews</h3>
                <p className="text-foreground">
                  Our reviews and recommendations are based on available information and our assessment. We do not guarantee product quality, performance, or reliability. Products and services may be updated or discontinued without notice.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">9.5 Limitation of Liability</h3>
                <p className="text-foreground">
                  Tech Pulse Insider is not liable for direct, indirect, incidental, or consequential damages arising from use of our content, including financial loss, reputational harm, or business disruption.
                </p>
              </div>
            </div>
          </Card>

          {/* 10. Feedback & Corrections */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">10. Feedback, Corrections & Appeals</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">10.1 Reporting Errors</h3>
                <p className="text-foreground">
                  We welcome feedback and corrections. If you notice an error or have concerns about content, please contact us with:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>Specific details of the error</li>
                  <li>URL or reference to the content</li>
                  <li>Credible sources supporting your correction</li>
                  <li>Your contact information (optional)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">10.2 Correction Response Time</h3>
                <p className="text-foreground">
                  We aim to review and respond to correction requests within 5 business days. If we identify an error, we publish a correction promptly.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">10.3 Appeals & Editorial Review</h3>
                <p className="text-foreground">
                  If you believe our editorial decisions are unfair, you can appeal to our Editorial Board. Appeals should be submitted in writing with supporting details.
                </p>
              </div>
            </div>
          </Card>

          {/* 11. Ethical Journalism Standards */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">11. Ethical Journalism Standards</h2>
            
            <p className="text-foreground mb-4">
              Tech Pulse Insider is committed to the principles outlined by major journalism organizations, including:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li><strong>Seek Truth & Report It:</strong> We pursue accurate, reliable information through ethical means</li>
              <li><strong>Minimize Harm:</strong> We consider impact on sources, subjects, and audiences</li>
              <li><strong>Act Independently:</strong> We avoid conflicts of interest and pressure from external interests</li>
              <li><strong>Be Accountable:</strong> We explain our choices and correct errors openly</li>
              <li><strong>Preserve Public Trust:</strong> We maintain the highest ethical standards to serve the public interest</li>
            </ul>
          </Card>

          {/* 12. Disclaimer for Rapid Tech Landscape */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">12. Disclaimer: Rapidly Changing Technology Landscape</h2>
            
            <p className="text-foreground mb-4">
              The technology industry evolves rapidly. Information published today may be outdated within months or weeks. We cannot guarantee that:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li>Product specifications remain accurate</li>
              <li>Company information is current</li>
              <li>Pricing or availability information is up-to-date</li>
              <li>Technical tutorials remain compatible with current versions</li>
              <li>Regulatory environments remain unchanged</li>
            </ul>
            
            <p className="text-foreground mt-4">
              Users should verify information with official company sources and verify technical content with current documentation.
            </p>
          </Card>

          {/* 13. Contact Us */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">13. Editorial Contact & Feedback</h2>
            
            <p className="text-foreground mb-4">
              Have feedback, corrections, or questions about our editorial policy? Contact us:
            </p>
            
            <div className="bg-muted p-4 rounded-lg space-y-2 text-foreground">
              <p><strong>Editorial Team</strong></p>
              <p>📧 Email: <a href="mailto:editorial@nakolaexpertsystems.com" className="text-primary hover:underline">editorial@nakolaexpertsystems.com</a></p>
              <p>💬 WhatsApp: <a href="https://wa.me/254715674828" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+254 715 674 828</a></p>
              <p>📍 Kenya</p>
              <p className="text-sm">Response time: We aim to respond within 7 business days</p>
            </div>
          </Card>

          {/* Footer Note */}
          <Card className="p-6 bg-primary/10 border-primary/20">
            <p className="text-foreground text-sm">
              <strong>Last Updated:</strong> This Editorial Policy is regularly reviewed and updated to reflect evolving standards and practices. The last revision was January 26, 2026. Subscribe to our newsletter to stay informed about policy updates and industry changes.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorialPolicy;
