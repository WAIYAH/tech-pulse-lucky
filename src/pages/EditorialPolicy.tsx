import { motion } from "framer-motion";
import { Newspaper, CheckCircle2, AlertCircle, Handshake, MessageSquare, Shield } from "lucide-react";

const EditorialPolicy = () => {
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
            <Newspaper className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Editorial <span className="text-primary">Policy</span>
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
              At Tech Pulse Insider, we are committed to providing accurate, informative, and 
              trustworthy content to our readers. This Editorial Policy outlines our standards 
              for content creation, fact-checking, sponsorship transparency, and how we maintain 
              the integrity of our platform.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">1. Our Editorial Mission</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>
                Tech Pulse Insider exists to bridge the digital divide by providing accessible, 
                high-quality tech education to individuals across Kenya and Africa. Our mission is to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Empower readers with practical tech skills and knowledge</li>
                <li>Promote cybersecurity awareness and digital safety</li>
                <li>Support Kenya's Vision 2030 and UN Sustainable Development Goals (SDG 4 & 9)</li>
                <li>Foster a community of learners and tech enthusiasts</li>
                <li>Provide unbiased, honest, and accurate information</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">2. Content Standards</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-lg font-semibold text-foreground">2.1 Accuracy & Fact-Checking</h3>
              <p>We are committed to accuracy in all our content. Our process includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Research:</strong> All articles are based on credible sources, including official documentation, peer-reviewed studies, and industry experts.</li>
                <li><strong>Verification:</strong> Facts, statistics, and claims are verified before publication.</li>
                <li><strong>Updates:</strong> We regularly review and update content to reflect new developments in technology.</li>
                <li><strong>Corrections:</strong> If errors are identified, we correct them promptly and transparently.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6">2.2 Originality</h3>
              <p>
                All content published on Tech Pulse Insider is original or properly attributed. 
                We do not plagiarize and give credit to sources when referencing external work.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">2.3 Objectivity</h3>
              <p>
                We strive to present balanced perspectives on technology topics. While our 
                content may express opinions (clearly labeled as such), we separate opinion 
                from factual reporting.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Handshake className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">3. Sponsorship & Advertising Transparency</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>
                We believe in full transparency regarding sponsored content and advertising. 
                Here's how we handle it:
              </p>

              <h3 className="text-lg font-semibold text-foreground">3.1 Sponsored Content</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All sponsored articles, reviews, or partnerships are <strong>clearly labeled</strong> as "Sponsored," "In Partnership With," or "Advertisement."</li>
                <li>Sponsored content meets the same quality and accuracy standards as our regular content.</li>
                <li>Sponsors do not have editorial control over our content.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6">3.2 Affiliate Links</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some articles may contain affiliate links where we earn a commission if you make a purchase.</li>
                <li>Affiliate relationships do not influence our editorial recommendations.</li>
                <li>We only recommend products and services we genuinely believe are valuable to our readers.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6">3.3 Advertising</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Display advertisements are clearly distinguishable from editorial content.</li>
                <li>We do not accept ads for products or services that are illegal, harmful, or misaligned with our values.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">4. Disclaimer</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Important Notice</h3>
                <p className="mb-4">
                  The content on Tech Pulse Insider is provided for <strong>educational and 
                  informational purposes only</strong>. It should not be considered as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Professional advice (legal, financial, medical, or otherwise)</li>
                  <li>A substitute for consultation with qualified professionals</li>
                  <li>A guarantee of specific outcomes or results</li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-foreground mt-6">4.1 Technology & Security Advice</h3>
              <p>
                While we provide cybersecurity tips and best practices, technology evolves 
                rapidly. Always verify security recommendations with current industry standards 
                and consult professionals for critical security decisions.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">4.2 Career & Business Guidance</h3>
              <p>
                Career advice and business strategies shared are based on general industry 
                knowledge. Individual circumstances vary, and we encourage readers to consider 
                their unique situations.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">4.3 Product Recommendations</h3>
              <p>
                Product reviews and recommendations reflect our honest opinions at the time of 
                writing. Features, pricing, and availability may change. Always research current 
                information before making purchasing decisions.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Author Guidelines</h2>
            <div className="text-muted-foreground space-y-4">
              <p>All contributors to Tech Pulse Insider must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Disclose any conflicts of interest related to topics they cover</li>
                <li>Not accept payment or gifts from companies in exchange for favorable coverage</li>
                <li>Base their writing on thorough research and credible sources</li>
                <li>Write in clear, accessible language suitable for our diverse audience</li>
                <li>Respect intellectual property rights and properly attribute sources</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Corrections Policy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                We take errors seriously. When mistakes are identified:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Minor Errors:</strong> Spelling, grammar, or minor factual corrections are made silently.</li>
                <li><strong>Significant Errors:</strong> Material corrections are noted at the bottom of the article with an explanation.</li>
                <li><strong>Major Retractions:</strong> If content is fundamentally flawed, we may retract the article with a public explanation.</li>
              </ul>
              <p>
                To report errors, please contact us at{" "}
                <a href="mailto:editorial@techpulseinsider.com" className="text-primary hover:underline">
                  editorial@techpulseinsider.com
                </a>.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-bold m-0">7. Community Standards</h2>
            </div>
            
            <div className="text-muted-foreground space-y-4">
              <p>
                Our community spaces (comments, WhatsApp groups, social media) are moderated 
                to maintain a respectful environment. We do not tolerate:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hate speech, discrimination, or harassment</li>
                <li>Spam or self-promotion without permission</li>
                <li>Misinformation or deliberately misleading content</li>
                <li>Sharing of malware, phishing, or harmful links</li>
                <li>Violation of others' privacy</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Editorial Independence</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Tech Pulse Insider maintains complete editorial independence. Our content 
                decisions are based solely on what we believe is valuable and relevant to 
                our readers. Sponsors, advertisers, and partners do not influence our 
                editorial judgment.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-secondary/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Questions or Feedback?</h2>
            <div className="text-muted-foreground space-y-2">
              <p>We welcome feedback on our content and editorial practices:</p>
              <p><strong>Editorial Team</strong></p>
              <p>Email: <a href="mailto:editorial@techpulseinsider.com" className="text-primary hover:underline">editorial@techpulseinsider.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/254715674828" className="text-primary hover:underline">+254 715 674 828</a></p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default EditorialPolicy;
