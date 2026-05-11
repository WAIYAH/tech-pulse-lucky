import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last Updated: January 26, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-foreground mb-4">
              Tech Pulse Insider ("we," "us," "our," or "Company") is committed to protecting your privacy and ensuring you have a positive experience on our website and digital platforms. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information across all our websites, mobile applications, social media platforms, email communications, and any other digital services we provide (collectively, the "Services").
            </p>
            <p className="text-foreground">
              We are headquartered in Kenya and operate across Africa. This policy complies with the Data Protection Act (2019) of Kenya and international best practices for digital media platforms.
            </p>
          </Card>

          {/* 1. Information We Collect */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">1.1 Information You Provide Directly</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li><strong>Contact Information:</strong> Name, email address, phone number, physical address, and other contact details when you subscribe, contact us, or register for webinars</li>
                  <li><strong>Account Information:</strong> Login credentials, profile information, preferences, and content you create (comments, messages, user-generated content)</li>
                  <li><strong>Communication Data:</strong> Messages, feedback, inquiries, support tickets, and correspondence with our team</li>
                  <li><strong>Payment Information:</strong> Credit card, mobile payment (M-Pesa, AirtelMoney), and billing details (processed securely through third-party payment providers)</li>
                  <li><strong>Survey & Research Data:</strong> Responses to surveys, polls, questionnaires, and feedback forms</li>
                  <li><strong>Content Interactions:</strong> Articles you read, videos you watch, webinars you attend, and topics you engage with</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">1.2 Information Collected Automatically</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers, and mobile network information</li>
                  <li><strong>Log Data:</strong> IP address, access times, pages viewed, referring/exit pages, and browsing activity</li>
                  <li><strong>Location Data:</strong> Approximate location based on IP address (we do not collect precise GPS location without consent)</li>
                  <li><strong>Cookies & Tracking:</strong> Usage data through cookies, web beacons, pixels, and similar tracking technologies</li>
                  <li><strong>Analytics Data:</strong> Content preferences, engagement metrics, reading time, video completion rates, and click-through data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">1.3 Information from Third Parties</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>Social media platforms (when you connect your social account)</li>
                  <li>Analytics and advertising partners</li>
                  <li>Business partners and service providers</li>
                  <li>Public sources and data aggregators (for verification purposes)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 2. How We Use Your Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            
            <p className="text-foreground mb-4">We use collected information for the following purposes:</p>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">a) Service Delivery:</span>
                <p className="text-foreground">Providing, maintaining, and improving our Services; processing transactions; and delivering requested content and functionality</p>
              </div>
              
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">b) Communication:</span>
                <p className="text-foreground">Sending newsletters, updates, webinar invitations, promotional materials, and responding to your inquiries</p>
              </div>
              
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">c) Personalization:</span>
                <p className="text-foreground">Customizing your experience, remembering preferences, and recommending relevant content</p>
              </div>
              
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">d) Analytics & Insights:</span>
                <p className="text-foreground">Understanding user behavior, measuring engagement, analyzing trends, and improving content strategy</p>
              </div>
              
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">e) Marketing & Advertising:</span>
                <p className="text-foreground">Delivering targeted ads, conducting marketing campaigns, and measuring campaign effectiveness (with your consent)</p>
              </div>
              
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">f) Legal & Security:</span>
                <p className="text-foreground">Complying with legal obligations, preventing fraud, protecting our rights, and ensuring platform security</p>
              </div>
              
              <div className="flex gap-3">
                <span className="font-semibold text-primary min-w-fit">g) Research & Development:</span>
                <p className="text-foreground">Improving features, testing new services, and advancing tech education initiatives across Africa</p>
              </div>
            </div>
          </Card>

          {/* 3. How We Share Your Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">3. How We Share Your Information</h2>
            
            <p className="text-foreground mb-4">We may share your information in the following circumstances:</p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Service Providers</h3>
                <p className="text-foreground">With vendors, contractors, and third-party service providers who assist in operating our website, processing payments, sending emails, hosting data, analyzing analytics, and providing customer support. These providers are contractually obligated to protect your data.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Advertising & Analytics Partners</h3>
                <p className="text-foreground">With advertising networks and analytics providers (Google Analytics, Facebook Pixel, etc.) for marketing, analytics, and audience insights. You can opt-out of targeted advertising.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Business Partners</h3>
                <p className="text-foreground">With educational institutions, tech companies, and content partners for collaborative initiatives, sponsorships, and content distribution.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Legal Requirements</h3>
                <p className="text-foreground">When required by law, court order, or government request; to enforce our Terms of Service; to protect our rights; or to protect the safety of our users and the public.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Business Transfers</h3>
                <p className="text-foreground">In the event of merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Aggregated & De-Identified Data</h3>
                <p className="text-foreground">We may share aggregated, anonymized, or de-identified data that cannot reasonably identify you with partners for research, marketing, and analytics purposes.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">With Your Consent</h3>
                <p className="text-foreground">We will share information with third parties only when you provide explicit consent or opt-in.</p>
              </div>
            </div>
          </Card>

          {/* 4. Data Security */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            
            <p className="text-foreground mb-4">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These include:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2 mb-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure password hashing and storage</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Data backup and disaster recovery protocols</li>
              <li>Employee training on data protection and privacy</li>
            </ul>
            
            <p className="text-foreground">
              <strong>Important Notice:</strong> While we use reasonable efforts to protect your information, no internet transmission is 100% secure. We cannot guarantee absolute security. You use our Services at your own risk.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">4.1 LMS and Payment Data Handling</h2>
            <div className="space-y-4 text-foreground">
              <p>
                For registered learners, we store account profile details, course enrollments,
                learning progress, and lesson completion status to deliver dashboard and LMS features.
              </p>
              <p>
                For paid courses, we collect payment confirmation details such as payer name, phone,
                email, transaction code, payment date, and optional proof link. These records are used
                only for verification, fraud prevention, support, and access approval workflows.
              </p>
              <p>
                Course access is controlled using status values such as{" "}
                <strong>Pending</strong>, <strong>Approved</strong>, and{" "}
                <strong>Rejected</strong>. Learners cannot self-approve access from the frontend.
              </p>
              <p>
                Payment confirmation records are retained only as long as required for compliance,
                dispute handling, and operational reporting.
              </p>
            </div>
          </Card>

          {/* 5. Your Privacy Rights */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">5. Your Privacy Rights</h2>
            
            <p className="text-foreground mb-4">
              Under the Data Protection Act (2019) of Kenya and similar regulations in other African countries, you have the following rights:
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Right to Access</h3>
                <p className="text-foreground">You can request access to the personal information we hold about you.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Right to Rectification</h3>
                <p className="text-foreground">You can request correction of inaccurate, incomplete, or outdated information.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Right to Erasure</h3>
                <p className="text-foreground">You can request deletion of your personal data, subject to legal and operational constraints.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Right to Restrict Processing</h3>
                <p className="text-foreground">You can request that we limit how we use your information.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Right to Data Portability</h3>
                <p className="text-foreground">You can request your data in a structured, machine-readable format.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Right to Object</h3>
                <p className="text-foreground">You can object to specific processing activities, including marketing communications.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Right to Withdraw Consent</h3>
                <p className="text-foreground">You can withdraw consent for processing at any time.</p>
              </div>
            </div>
            
            <p className="text-foreground mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@techpulseinsider.com" className="text-primary hover:underline">privacy@techpulseinsider.com</a> with your request and verification details.
            </p>
          </Card>

          {/* 6. Cookies & Tracking */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">6. Cookies & Tracking Technologies</h2>
            
            <p className="text-foreground mb-4">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content.
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Types of Cookies:</h3>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand user behavior</li>
                  <li><strong>Marketing Cookies:</strong> Enable targeted advertising</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Managing Cookies:</h3>
                <p className="text-foreground">
                  You can manage cookie preferences from our cookie consent banner by selecting
                  Accept or Decline. You can also control cookies through your browser settings.
                  Blocking cookies may affect certain LMS and personalization features.
                </p>
              </div>
            </div>
          </Card>

          {/* 7. Email Communications */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">7. Email Communications & Marketing</h2>
            
            <p className="text-foreground mb-4">
              We send newsletters, updates, and promotional content to subscribers. You can manage communication preferences by:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li>Clicking "Unsubscribe" in any email we send</li>
              <li>Updating your preferences in your account settings</li>
              <li>Contacting us directly at <a href="mailto:hello@techpulseinsider.com" className="text-primary hover:underline">hello@techpulseinsider.com</a></li>
            </ul>
            
            <p className="text-foreground mt-4">
              Note: You cannot opt-out of transactional emails (account confirmations, password resets, etc.).
            </p>
          </Card>

          {/* 8. Third-Party Links */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">8. Third-Party Links & Services</h2>
            
            <p className="text-foreground">
              Our Services may contain links to third-party websites, apps, and services that are not operated by us. This Privacy Policy does not apply to third-party platforms. We are not responsible for their privacy practices. We recommend reviewing their privacy policies before providing any information.
            </p>
          </Card>

          {/* 9. Children's Privacy */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            
            <p className="text-foreground mb-4">
              Tech Pulse Insider is not intended for children under 13 years old. We do not knowingly collect personal information from children without parental consent. If we become aware that we have collected information from a child under 13, we will promptly delete it.
            </p>
            
            <p className="text-foreground">
              For content appropriate for younger audiences, parents and guardians should supervise their children's use of our Services and manage privacy settings accordingly.
            </p>
          </Card>

          {/* 10. Data Retention */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">10. Data Retention</h2>
            
            <p className="text-foreground mb-4">
              We retain your personal information for as long as necessary to provide our Services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Generally:
            </p>
            
            <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
              <li><strong>Account Information:</strong> Retained while your account is active; deleted upon request or account closure</li>
              <li><strong>Communications:</strong> Retained for up to 2 years for customer service purposes</li>
              <li><strong>Analytics Data:</strong> Retained for up to 26 months</li>
              <li><strong>Legal/Compliance Data:</strong> Retained as required by Kenyan law (typically 7 years)</li>
              <li><strong>Marketing Data:</strong> Retained until you unsubscribe</li>
            </ul>
          </Card>

          {/* 11. International Data Transfers */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">11. International Data Transfers</h2>
            
            <p className="text-foreground">
              While we are based in Kenya, some of our service providers may process data in other countries, including outside Africa. We ensure that such transfers comply with applicable data protection laws, including the Data Protection Act (2019) of Kenya. We use contractual safeguards and ensure recipients provide adequate protection for your information.
            </p>
          </Card>

          {/* 12. Changes to This Policy */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            
            <p className="text-foreground">
              We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last Updated" date and, when appropriate, sending you an email notification. Your continued use of our Services after changes constitutes acceptance of the updated policy.
            </p>
          </Card>

          {/* 13. Contact Us */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            
            <p className="text-foreground mb-4">
              If you have questions about this Privacy Policy, concerns about our privacy practices, or wish to exercise your privacy rights, please contact us:
            </p>
            
            <div className="bg-muted p-4 rounded-lg space-y-2 text-foreground">
              <p><strong>Tech Pulse Insider</strong></p>
              <p>📧 Email: <a href="mailto:privacy@techpulseinsider.com" className="text-primary hover:underline">privacy@techpulseinsider.com</a></p>
              <p>💬 WhatsApp: <a href="https://wa.me/254715674828" className="text-primary hover:underline">+254 715 674 828</a></p>
              <p>📍 Kenya</p>
              <p className="text-sm">Response time: We aim to respond to privacy inquiries within 14 days.</p>
            </div>
          </Card>

          {/* Footer Note */}
          <Card className="p-6 bg-primary/10 border-primary/20">
            <p className="text-foreground text-sm">
              <strong>Data Protection Officer:</strong> For formal data protection complaints or inquiries, you can also contact the Office of the Data Protection Commissioner (ODPC) in Kenya at <a href="https://www.odpc.go.ke" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">odpc.go.ke</a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
