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
      </div>
    </div>
  );
};

export default TermsOfService;
