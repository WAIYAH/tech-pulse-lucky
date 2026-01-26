import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Users, Globe } from "lucide-react";

const PrivacyPolicy = () => {
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
            <Shield className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy <span className="text-primary">Policy</span>
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
              At Tech Pulse Insider ("we," "us," or "our"), we are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information when you visit our website 
              and use our services. This policy is designed to comply with the Kenya Data Protection 
              Act, 2019 and international best practices.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground">1.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contact Information:</strong> Name, email address, phone number, and WhatsApp contact details when you subscribe to our newsletter, register for webinars, or contact us.</li>
                <li><strong>Account Information:</strong> Username, password, and profile preferences if you create an account on our platform.</li>
                <li><strong>Payment Information:</strong> Billing details and transaction records when you purchase masterclasses or services (processed securely through third-party payment providers).</li>
                <li><strong>Professional Information:</strong> Job title, company, and areas of interest for personalized content recommendations.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6">1.2 Automatically Collected Information</h3>
              <p>When you access our website, we automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and IP address.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and navigation patterns.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience and analyze website traffic.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Eye className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">2. How We Use Your Information</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Delivery:</strong> To provide access to our articles, webinars, masterclasses, and community features.</li>
                <li><strong>Communication:</strong> To send newsletters, tech tips, event updates, and respond to your inquiries.</li>
                <li><strong>Personalization:</strong> To tailor content recommendations based on your interests and browsing behavior.</li>
                <li><strong>Analytics:</strong> To understand user behavior and improve our platform's functionality and content quality.</li>
                <li><strong>Marketing:</strong> To inform you about new services, promotions, and events (with your consent).</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">3. Information Sharing and Disclosure</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>We do not sell your personal information. We may share your information only in these circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform (hosting, analytics, payment processing, email services).</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority.</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets.</li>
                <li><strong>With Your Consent:</strong> For any other purpose with your explicit permission.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Lock className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">4. Data Security</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure hosting infrastructure with regular security audits</li>
                <li>Access controls limiting who can view your information</li>
                <li>Regular security training for our team</li>
              </ul>
              <p>
                While we strive to protect your information, no method of transmission over the Internet 
                is 100% secure. We cannot guarantee absolute security but will notify you of any breach 
                affecting your data as required by law.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Globe className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">5. Your Rights Under Kenya Data Protection Act</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>Under the Kenya Data Protection Act, 2019, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data in certain circumstances.</li>
                <li><strong>Right to Object:</strong> Object to processing of your data for direct marketing.</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used format.</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time.</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@techpulseinsider.com" className="text-primary hover:underline">
                  privacy@techpulseinsider.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Cookies Policy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent).</li>
              </ul>
              <p>
                You can control cookies through your browser settings. Note that disabling certain 
                cookies may affect website functionality.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. Third-Party Links</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Our website may contain links to third-party websites, including social media platforms 
                and payment providers. We are not responsible for the privacy practices of these 
                external sites. We encourage you to review their privacy policies before providing 
                any personal information.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Our services are not directed to individuals under 16 years of age. We do not 
                knowingly collect personal information from children. If you believe we have 
                collected information from a child, please contact us immediately.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Your information may be transferred to and processed in countries outside Kenya. 
                We ensure appropriate safeguards are in place to protect your data in accordance 
                with applicable data protection laws.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant 
                changes by posting a notice on our website or sending you an email. The "Last Updated" 
                date indicates when changes were made.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-secondary/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="text-muted-foreground space-y-2">
              <p>For privacy-related questions or to exercise your rights, contact us:</p>
              <p><strong>Tech Pulse Insider</strong></p>
              <p>Email: <a href="mailto:privacy@techpulseinsider.com" className="text-primary hover:underline">privacy@techpulseinsider.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/254715674828" className="text-primary hover:underline">+254 715 674 828</a></p>
              <p>Location: Nairobi, Kenya</p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
