<<<<<<< HEAD
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last Updated: January 26, 2026
          </p>
        </div>

        {/* Alert */}
        <Alert className="mb-8 border-yellow-600/30 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Please read these Terms of Service carefully. By accessing and using Tech Pulse Insider, you agree to be bound by these terms.
          </AlertDescription>
        </Alert>

        {/* Content */}
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            
            <p className="text-foreground mb-4">
              By accessing, browsing, and using Tech Pulse Insider's website, mobile applications, social media platforms, and all related services (collectively, the "Services"), you agree to comply with and be legally bound by these Terms of Service ("Terms") and all policies referenced herein, including our Privacy Policy and Editorial Policy.
            </p>
            
            <p className="text-foreground">
              If you do not agree to these Terms, you must immediately discontinue use of our Services. Your continued use of the Services constitutes acceptance of these Terms.
            </p>
          </Card>

          {/* 2. Use License */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            
            <p className="text-foreground mb-4">
              Tech Pulse Insider grants you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for personal, non-commercial purposes, subject to these Terms.
            </p>
            
            <div className="space-y-3 mt-4">
              <div>
                <h3 className="font-semibold mb-2">You are prohibited from:</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>Reproducing, duplicating, copying, selling, reselling, or exploiting content for commercial purposes without permission</li>
                  <li>Modifying or altering our Services or creating derivative works</li>
                  <li>Framing or mirroring any portion of our website</li>
                  <li>Using automated tools (bots, scrapers, crawlers) to extract data without authorization</li>
                  <li>Reverse-engineering, decompiling, or attempting to derive source code</li>
                  <li>Removing or altering any proprietary notices, labels, or marks</li>
                  <li>Using our Services for commercial gain or business purposes without a commercial license</li>
                  <li>Accessing Services through unauthorized means or circumventing security measures</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 3. User Accounts & Registration */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">3. User Accounts & Registration</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">3.1 Account Creation</h3>
                <p className="text-foreground">
                  To access certain features, you may need to create an account. You agree to provide accurate, current, and complete information and to update it as necessary. You are responsible for maintaining the confidentiality of your password and account.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3.2 Your Responsibility</h3>
                <p className="text-foreground">
                  You are solely responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or breach of security.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3.3 Eligibility</h3>
                <p className="text-foreground">
                  You represent that you are at least 18 years old (or the legal age of majority in your jurisdiction) and have the legal capacity to enter into these Terms. Parents/guardians are responsible for supervising children's use of the Services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3.4 Account Termination</h3>
                <p className="text-foreground">
                  We reserve the right to suspend or terminate your account without notice if you violate these Terms, engage in fraudulent activity, or violate applicable laws. Upon termination, your right to use the Services ceases immediately.
                </p>
              </div>
            </div>
          </Card>

          {/* 4. Content & Intellectual Property */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">4. Content & Intellectual Property Rights</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">4.1 Our Content</h3>
                <p className="text-foreground">
                  All content provided on Tech Pulse Insider, including text, graphics, logos, images, videos, audio, code, and software (collectively, "Our Content"), is the exclusive property of Tech Pulse Insider or our content providers and is protected by international copyright, trademark, and other intellectual property laws. Unauthorized use is strictly prohibited.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">4.2 Limited License for Personal Use</h3>
                <p className="text-foreground">
                  You may download and print Our Content for personal, non-commercial use only. You must retain all copyright and proprietary notices. Any other reproduction or distribution without prior written consent is prohibited.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">4.3 Your User-Generated Content</h3>
                <p className="text-foreground mb-2">
                  When you submit comments, messages, testimonials, or other content ("User Content"), you retain ownership but grant Tech Pulse Insider a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute your User Content for any purpose, including commercial purposes, without compensation or further consent.
                </p>
                <p className="text-foreground">
                  You represent and warrant that your User Content is original, does not infringe intellectual property rights, and complies with all laws and these Terms. Tech Pulse Insider is not responsible for User Content and has no obligation to monitor, edit, or remove it, though we reserve the right to do so.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">4.4 Acceptable Use</h3>
                <p className="text-foreground mb-2">
                  Your User Content must not contain:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                  <li>Unlawful, hateful, discriminatory, or harassing content</li>
                  <li>Sexually explicit, obscene, or inappropriate material</li>
                  <li>Misinformation, disinformation, or false claims presented as fact</li>
                  <li>Personal information of third parties without consent</li>
                  <li>Spam, advertising, or promotional content (unless authorized)</li>
                  <li>Malware, viruses, or harmful code</li>
                  <li>Content that violates others' rights or applicable laws</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 5. User Conduct */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">5. User Conduct & Community Standards</h2>
            
            <p className="text-foreground mb-4">
              You agree to use Tech Pulse Insider responsibly and in compliance with all applicable laws. Prohibited conduct includes:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li>Harassment, bullying, threats, or abuse of other users or our team</li>
              <li>Posting spam, repetitive messages, or phishing content</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with platform functionality or other users' access</li>
              <li>Creating multiple accounts to circumvent restrictions</li>
              <li>Impersonating other individuals or organizations</li>
              <li>Distributing malware, viruses, or malicious code</li>
              <li>Violating privacy or confidentiality of others</li>
              <li>Engaging in any illegal activity</li>
            </ul>
            
            <p className="text-foreground mt-4">
              We reserve the right to remove, restrict, or report User Content and suspend or terminate accounts that violate these standards.
            </p>
          </Card>

          {/* 6. Limitation of Liability */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            
            <div className="space-y-4 text-foreground">
              <p>
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECH PULSE INSIDER AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION, ARISING FROM:</strong>
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Your use or inability to use the Services</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Third-party content, links, or services</li>
                <li>Delays, interruptions, or errors in the Services</li>
                <li>Content, products, or services obtained through the Services</li>
              </ul>
              
              <p className="mt-4">
                <strong>Our total liability to you for any claims arising from these Terms shall not exceed KES 10,000 (ten thousand Kenyan shillings) or the amount you paid, whichever is less.</strong>
              </p>
              
              <p className="mt-4 text-sm italic">
                Some jurisdictions do not allow limitations on liability. In such cases, our liability is limited to the maximum extent permitted by law.
              </p>
            </div>
          </Card>

          {/* 7. Disclaimer of Warranties */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">7. Disclaimer of Warranties</h2>
            
            <p className="text-foreground mb-4">
              <strong>THE SERVICES AND ALL CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</strong>
            </p>
            
            <p className="text-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            
            <p className="text-foreground">
              We do not warrant that the Services will be uninterrupted, error-free, secure, or free from viruses or harmful components. We do not guarantee the accuracy, completeness, or timeliness of any information or content provided.
            </p>
          </Card>

          {/* 8. Third-Party Content & Links */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">8. Third-Party Content & Links</h2>
            
            <p className="text-foreground mb-4">
              Our Services may contain links to third-party websites, applications, and content that we do not control. We are not responsible for:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li>Third-party content, products, or services</li>
              <li>Accuracy, legality, or quality of third-party offerings</li>
              <li>Privacy practices of third-party platforms</li>
              <li>Technical issues or security breaches on third-party sites</li>
            </ul>
            
            <p className="text-foreground mt-4">
              Your use of third-party platforms is subject to their terms and policies. We recommend reviewing their terms before providing information or making purchases.
            </p>
          </Card>

          {/* 9. Indemnification */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            
            <p className="text-foreground">
              You agree to indemnify, defend, and hold harmless Tech Pulse Insider and its officers, directors, employees, agents, and partners from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2 mt-3">
              <li>Your violation of these Terms</li>
              <li>Your use of the Services</li>
              <li>Your User Content</li>
              <li>Your infringement of intellectual property or other rights</li>
              <li>Any unlawful or harmful activity by you</li>
            </ul>
          </Card>

          {/* 10. Modification of Terms */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">10. Modification of Terms & Services</h2>
            
            <p className="text-foreground mb-4">
              We reserve the right to modify these Terms at any time. Material changes will be posted on this page, and we will notify users via email or prominent notice on the website. Your continued use of the Services after modifications constitutes acceptance of the updated Terms.
            </p>
            
            <p className="text-foreground">
              We also reserve the right to modify, suspend, or discontinue the Services (or any part thereof) at any time with or without notice. We are not liable for any such modifications or discontinuation.
            </p>
          </Card>

          {/* 11. Termination */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">11. Termination of Your Access</h2>
            
            <p className="text-foreground mb-4">
              We may terminate or suspend your access to the Services immediately, without notice or liability, for any reason, including:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li>Violation of these Terms</li>
              <li>Violation of applicable laws</li>
              <li>Fraudulent activity or abuse</li>
              <li>Repeated policy violations</li>
              <li>Request by law enforcement or legal authorities</li>
            </ul>
            
            <p className="text-foreground mt-4">
              Upon termination, you must cease all use of the Services. Provisions that by their nature survive termination will continue to apply.
            </p>
          </Card>

          {/* 12. Governing Law & Jurisdiction */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">12. Governing Law & Dispute Resolution</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">12.1 Governing Law</h3>
                <p className="text-foreground">
                  These Terms are governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">12.2 Dispute Resolution</h3>
                <p className="text-foreground mb-2">
                  Any dispute arising from these Terms or your use of the Services shall be:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>First, addressed through informal negotiation and good faith discussion</li>
                  <li>If unresolved, submitted to mediation before legal action</li>
                  <li>If mediation fails, resolved through binding arbitration or court proceedings in Kenya</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">12.3 Jurisdiction</h3>
                <p className="text-foreground">
                  You agree to submit to the exclusive jurisdiction of the courts of Kenya for any legal proceedings.
                </p>
              </div>
            </div>
          </Card>

          {/* 13. Severability */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">13. Severability</h2>
            
            <p className="text-foreground">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision shall be severed, and the remaining provisions shall continue in full force and effect to the maximum extent permitted by law.
            </p>
          </Card>

          {/* 14. Entire Agreement */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">14. Entire Agreement</h2>
            
            <p className="text-foreground">
              These Terms, together with our Privacy Policy, Editorial Policy, and any other policies referenced herein, constitute the entire agreement between you and Tech Pulse Insider regarding your use of the Services and supersede all prior negotiations, understandings, and agreements, whether written or oral.
            </p>
          </Card>

          {/* 15. Contact Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
            
            <p className="text-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            
            <div className="bg-muted p-4 rounded-lg space-y-2 text-foreground">
              <p><strong>Tech Pulse Insider</strong></p>
              <p>📧 Email: <a href="mailto:legal@techpulseinsider.com" className="text-primary hover:underline">legal@techpulseinsider.com</a></p>
              <p>💬 WhatsApp: <a href="https://wa.me/254715674828" className="text-primary hover:underline">+254 715 674 828</a></p>
              <p>📍 Kenya</p>
            </div>
          </Card>

          {/* Footer Note */}
          <Card className="p-6 bg-primary/10 border-primary/20">
            <p className="text-foreground text-sm">
              <strong>Acknowledgment:</strong> By using Tech Pulse Insider, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by their terms and conditions.
            </p>
          </Card>
        </div>
=======
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Scale, CreditCard, Ban, RefreshCw } from "lucide-react";

const TermsOfService = () => {
  const lastUpdated = "January 26, 2026";

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to Tech Pulse Insider. These Terms of Service ("Terms") govern your access 
              to and use of the Tech Pulse Insider website, services, and content. By accessing 
              or using our platform, you agree to be bound by these Terms. If you do not agree, 
              please do not use our services.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">1. Definitions</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Tech Pulse Insider," "we," "us," "our"</strong> refers to Tech Pulse Insider, operated by Lucky Nakola, based in Nairobi, Kenya.</li>
                <li><strong>"Platform"</strong> refers to the Tech Pulse Insider website, mobile applications, and all associated services.</li>
                <li><strong>"User," "you," "your"</strong> refers to any individual or entity accessing or using our Platform.</li>
                <li><strong>"Content"</strong> refers to all articles, videos, webinars, courses, graphics, and other materials on our Platform.</li>
                <li><strong>"Services"</strong> includes free content, paid masterclasses, webinars, newsletters, and community features.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Acceptance of Terms</h2>
            <div className="text-muted-foreground space-y-4">
              <p>By using our Platform, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are at least 16 years of age, or have parental/guardian consent.</li>
                <li>You have the legal capacity to enter into binding contracts.</li>
                <li>You will comply with all applicable laws and regulations in Kenya and your jurisdiction.</li>
                <li>You have read and understood our Privacy Policy.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-lg font-semibold text-foreground">3.1 Account Registration</h3>
              <p>
                Some features require account registration. You agree to provide accurate, 
                current, and complete information during registration and keep your account 
                information updated.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">3.2 Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities under your account. Notify us immediately if you suspect 
                unauthorized access at{" "}
                <a href="mailto:security@techpulseinsider.com" className="text-primary hover:underline">
                  security@techpulseinsider.com
                </a>.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">3.3 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms 
                or engage in harmful behavior, with or without notice.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <CreditCard className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">4. Paid Services & Payments</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-lg font-semibold text-foreground">4.1 Pricing</h3>
              <p>
                Prices for paid masterclasses and services are displayed in Kenyan Shillings (KES) 
                unless otherwise stated. We reserve the right to modify pricing with reasonable notice.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">4.2 Payment Methods</h3>
              <p>
                We accept payments through M-Pesa, credit/debit cards, and other methods as 
                available. All payments are processed securely through our payment partners.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">4.3 Refund Policy</h3>
              <p>
                Refund requests for masterclasses must be submitted within 24 hours of purchase 
                and before accessing more than 25% of the content. Webinar fees are non-refundable 
                once the session has occurred. Contact us at{" "}
                <a href="mailto:support@techpulseinsider.com" className="text-primary hover:underline">
                  support@techpulseinsider.com
                </a>{" "}
                for refund requests.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-lg font-semibold text-foreground">5.1 Our Content</h3>
              <p>
                All Content on the Platform, including articles, videos, graphics, logos, and 
                trademarks, is owned by Tech Pulse Insider or our licensors and is protected 
                by copyright and intellectual property laws.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">5.2 Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and 
                use our Content for personal, non-commercial purposes. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, reproduce, or distribute our Content without permission</li>
                <li>Modify, adapt, or create derivative works</li>
                <li>Use Content for commercial purposes without a license agreement</li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">5.3 User-Generated Content</h3>
              <p>
                By submitting content (comments, testimonials, etc.), you grant us a worldwide, 
                royalty-free license to use, display, and distribute such content in connection 
                with our services.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Ban className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">6. Prohibited Conduct</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Platform for any unlawful purpose</li>
                <li>Share, distribute, or resell paid content</li>
                <li>Attempt to hack, disrupt, or compromise our systems</li>
                <li>Impersonate others or misrepresent your identity</li>
                <li>Post spam, malware, or harmful content</li>
                <li>Harass, abuse, or discriminate against other users</li>
                <li>Scrape or extract data from our Platform without permission</li>
                <li>Use automated bots or scripts to access our services</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">7. Disclaimers</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-lg font-semibold text-foreground">7.1 Educational Content</h3>
              <p>
                Our Content is for educational and informational purposes only. It does not 
                constitute professional advice (legal, financial, or otherwise). Always consult 
                qualified professionals for specific guidance.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">7.2 No Guarantees</h3>
              <p>
                While we strive for accuracy, we do not guarantee that our Content is error-free, 
                complete, or current. Results from applying our educational content may vary.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-4">7.3 Third-Party Content</h3>
              <p>
                We may link to third-party websites or resources. We are not responsible for 
                their content, accuracy, or practices.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                To the maximum extent permitted by law, Tech Pulse Insider and its affiliates 
                shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages arising from your use of the Platform, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or technical failures</li>
                <li>Unauthorized access to your account</li>
                <li>Errors or omissions in Content</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount you paid us in the 12 months 
                preceding the claim.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                You agree to indemnify and hold harmless Tech Pulse Insider, its founder, 
                employees, and partners from any claims, damages, losses, or expenses arising 
                from your violation of these Terms or misuse of our Platform.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <RefreshCw className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">10. Modifications to Terms</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>
                We may update these Terms at any time. Significant changes will be communicated 
                through our website or email. Continued use of the Platform after changes 
                constitutes acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">11. Governing Law & Dispute Resolution</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                These Terms are governed by the laws of the Republic of Kenya. Any disputes 
                shall be resolved through:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Negotiation:</strong> Initial attempt to resolve disputes amicably.</li>
                <li><strong>Mediation:</strong> If negotiation fails, disputes may be submitted to mediation.</li>
                <li><strong>Arbitration/Courts:</strong> Unresolved disputes shall be submitted to the courts of Kenya.</li>
              </ol>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">12. Severability</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining 
                provisions shall continue in full force and effect.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-secondary/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="text-muted-foreground space-y-2">
              <p>For questions about these Terms, contact us:</p>
              <p><strong>Tech Pulse Insider</strong></p>
              <p>Email: <a href="mailto:legal@techpulseinsider.com" className="text-primary hover:underline">legal@techpulseinsider.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/254715674828" className="text-primary hover:underline">+254 715 674 828</a></p>
              <p>Location: Nairobi, Kenya</p>
            </div>
          </section>
        </motion.div>
>>>>>>> cf0b67c59da1c00f964e7861d895f7c4f07bedd1
      </div>
    </div>
  );
};

export default TermsOfService;
