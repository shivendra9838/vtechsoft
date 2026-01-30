import express from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

const router = express.Router();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'vtechsoft9838@gmail.com',
      pass: process.env.EMAIL_PASS // Use app password for Gmail
    }
  });
};

// @route   POST /api/contact
// @desc    Handle contact form submissions
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate input
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number',
      });
    }

    // Save contact message to database
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      priority: subject.toLowerCase().includes('urgent') ? 'high' : 'medium'
    });

    await contact.save();

    // Send email notification to admin (with error handling)
    try {
      const transporter = createTransporter();
      
      // Admin email content
      const adminMailOptions = {
        from: process.env.EMAIL_USER || 'vtechsoft9838@gmail.com',
        to: 'vtechsoft9838@gmail.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: #0f2942; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">VTECHSOFT Technology Website</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 25px;">
                <h2 style="color: #0f2942; margin-bottom: 15px; font-size: 18px;">Contact Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Name:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Phone:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Subject:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Priority:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${contact.priority}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Submitted:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${contact.formattedDate}</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h2 style="color: #0f2942; margin-bottom: 15px; font-size: 18px;">Message</h2>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #2dd4bf;">
                  <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" style="display: inline-block; background-color: #2dd4bf; color: #0f2942; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                  Reply to Customer
                </a>
                <a href="tel:${phone}" style="display: inline-block; background-color: #0f2942; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Call Customer
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
              <p>This is an automated message from VTECHSOFT Technology Contact Form</p>
            </div>
          </div>
        `
      };

      // Customer confirmation email
      const customerMailOptions = {
        from: process.env.EMAIL_USER || 'vtechsoft9838@gmail.com',
        to: email,
        subject: 'Thank you for contacting VTECHSOFT Technology',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: #0f2942; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">VTECHSOFT Technology</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Dear <strong>${name}</strong>,
              </p>
              
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to VTECHSOFT Technology. We have successfully received your message with the subject "<strong>${subject}</strong>".
              </p>
              
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Our team will review your inquiry and get back to you within 24 hours. We're excited to learn more about your project and discuss how we can help bring your ideas to life.
              </p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #2dd4bf; padding: 20px; margin: 25px 0; border-radius: 6px;">
                <h3 style="color: #0f2942; margin-top: 0; margin-bottom: 10px;">What happens next?</h3>
                <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Our team reviews your message</li>
                  <li>We'll assess your project requirements</li>
                  <li>You'll receive a detailed response within 24 hours</li>
                  <li>We'll schedule a consultation if needed</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <h3 style="color: #0f2942; margin-bottom: 15px;">Need to reach us urgently?</h3>
                <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                  <a href="tel:+918052808612" style="display: inline-block; background-color: #2dd4bf; color: #0f2942; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    📞 Call Us
                  </a>
                  <a href="mailto:vtechsoft9838@gmail.com" style="display: inline-block; background-color: #0f2942; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    ✉️ Email Us
                  </a>
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
                <p style="margin: 0;">VTECHSOFT Technology | C-56A/1, Sector-62, Noida, UP</p>
                <p style="margin: 5px 0;">📱 +91 8052808612 | ✉️ vtechsoft9838@gmail.com</p>
              </div>
            </div>
          </div>
        `
      };

      // Send emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(customerMailOptions);
      console.log('Emails sent successfully for contact submission:', { name, email, subject });
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Continue even if email fails - the message is saved in database
    }

    // Return success response
    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.',
      data: {
        name,
        email,
        phone,
        subject,
        submittedAt: contact.createdAt,
        id: contact._id
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (for admin)
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact message
// @access  Private (Admin only)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

// @route   PUT /api/contact/:id
// @desc    Update contact message status/notes
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes, assignedTo } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, notes, assignedTo },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

export default router;
