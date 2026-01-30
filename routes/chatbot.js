import express from 'express';

const router = express.Router();

// Store conversation history (in production, use a database)
const conversations = new Map();

// @route   POST /api/chatbot
// @desc    Handle chatbot messages
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Get or create conversation history
    let history = conversations.get(sessionId) || [];

    // Add user message to history
    history.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Generate bot response
    const botResponse = generateBotResponse(message, history);

    // Add bot response to history
    history.push({
      role: 'bot',
      content: botResponse,
      timestamp: new Date(),
    });

    // Update conversation history (keep last 10 messages)
    conversations.set(sessionId, history.slice(-10));

    res.json({
      success: true,
      response: botResponse,
      sessionId,
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing your message',
    });
  }
});

// @route   DELETE /api/chatbot/:sessionId
// @desc    Clear conversation history
// @access  Public
router.delete('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    conversations.delete(sessionId);
    
    res.json({
      success: true,
      message: 'Conversation history cleared',
    });
  } catch (error) {
    console.error('Clear conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing conversation',
    });
  }
});

function generateBotResponse(message, history) {
  const msg = message.toLowerCase();
  
  // Owner/Developer information
  if (msg.includes('who made') || msg.includes('who develop') || msg.includes('who created') || msg.includes('owner') || msg.includes('made this') || msg.includes('developed by')) {
    return "VTECHSOFT Technology was founded by Vivek Shukla, who is the owner and visionary behind our company. The website and technical development were led by Shivendra Tiwari, our talented developer who brought this digital platform to life. Together, they've created a comprehensive technology solution to serve businesses worldwide!";
  }
  
  if (msg.includes('vivek') || msg.includes('shukla')) {
    return "Vivek Shukla is the founder and owner of VTECHSOFT Technology. With his vision and leadership, he has guided the company to become a leading technology solutions provider. Vivek oversees business strategy and ensures we deliver exceptional value to all our clients.";
  }
  
  if (msg.includes('shivendra') || msg.includes('tiwari')) {
    return "Shivendra Tiwari is our lead developer who created and developed this amazing website! He's responsible for the technical architecture, frontend design, and backend systems that power VTECHSOFT's digital presence. Shivendra's expertise in modern web technologies ensures our platform runs smoothly and efficiently.";
  }
  
  // Service-related responses
  if (msg.includes('web development') || msg.includes('website')) {
    return "We offer comprehensive web development services including React, Vue, Angular, and custom solutions. Our team builds scalable, responsive applications tailored to your business needs. Would you like to know more about our web development process?";
  }
  
  if (msg.includes('mobile') || msg.includes('app')) {
    return "Our mobile app development covers both iOS and Android platforms using React Native and Flutter. We create high-performance, user-friendly mobile applications. What type of mobile app are you looking to develop?";
  }
  
  if (msg.includes('cloud') || msg.includes('aws') || msg.includes('azure')) {
    return "We provide cloud architecture and migration services for AWS, Azure, and Google Cloud. Our experts help businesses optimize cloud infrastructure for scalability and cost-efficiency. Which cloud platform interests you?";
  }
  
  if (msg.includes('ai') || msg.includes('machine learning')) {
    return "Our AI/ML services include predictive analytics, natural language processing, computer vision, and custom ML model development. We help businesses leverage AI for automation and insights. What AI solution are you exploring?";
  }
  
  if (msg.includes('devops') || msg.includes('deployment')) {
    return "Our DevOps services include CI/CD pipeline setup, containerization with Docker, Kubernetes orchestration, and infrastructure as code. We streamline your development and deployment processes. What DevOps challenges are you facing?";
  }
  
  if (msg.includes('ui') || msg.includes('ux') || msg.includes('design')) {
    return "Our UI/UX team creates intuitive, beautiful interfaces that delight users. We offer user research, wireframing, prototyping, and design system development. What kind of design project do you have in mind?";
  }
  
  // Pricing and contact responses
  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    return "Our pricing varies based on project scope and requirements. We offer flexible engagement models from fixed-price projects to dedicated teams. For a detailed quote, please share your project requirements or schedule a consultation with our team.";
  }
  
  if (msg.includes('contact') || msg.includes('talk') || msg.includes('speak')) {
    return "You can reach us through our contact form, email us at info@vtechsoft.com, or call us at +91-XXXXXXXXXX. Our team is available Monday-Friday, 9 AM to 6 PM IST. Would you like me to direct you to our contact page?";
  }
  
  // Company information
  if (msg.includes('about') || msg.includes('company') || msg.includes('who')) {
    return "VTECHSOFT Technology is a leading software development company specializing in web, mobile, cloud, and AI solutions. Founded by Vivek Shukla and developed by Shivendra Tiwari, we've helped 100+ businesses transform digitally with our innovative technology solutions. Learn more about our journey and team on our About page!";
  }
  
  if (msg.includes('experience') || msg.includes('years') || msg.includes('since')) {
    return "With over 8 years of experience in software development, we've successfully delivered 500+ projects across various industries. Our team of 50+ experts brings deep domain knowledge and technical excellence to every project.";
  }
  
  // Technical responses
  if (msg.includes('technology') || msg.includes('tech stack') || msg.includes('tools')) {
    return "We work with modern technologies including React, Vue, Angular, Node.js, Python, Java, AWS, Azure, Docker, Kubernetes, TensorFlow, and more. We choose the right technology stack based on your specific requirements and business goals.";
  }
  
  // Process and timeline
  if (msg.includes('process') || msg.includes('how') || msg.includes('timeline')) {
    return "Our development process includes: 1) Discovery & Planning, 2) Design & Prototyping, 3) Development & Testing, 4) Deployment & Support. Typical project timelines range from 2-12 weeks depending on complexity. Would you like details about any specific phase?";
  }
  
  // Default responses
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! 👋 How can I help you with VTECHSOFT's services today? Are you looking for web development, mobile apps, cloud solutions, or something else?";
  }
  
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're welcome! 😊 Is there anything else I can help you with regarding our services or technology solutions?";
  }
  
  if (msg.includes('bye') || msg.includes('goodbye')) {
    return "Thank you for chatting with us! Feel free to reach out anytime through our contact page or email. Have a great day! 🌟";
  }
  
  // Catch-all response
  return "I'd be happy to help you with information about our web development, mobile apps, cloud services, AI/ML solutions, DevOps, or UI/UX design. You can also ask about our pricing, process, company information, or our founder Vivek Shukla and developer Shivendra Tiwari!";
}

export default router;
