import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

dotenv.config();

const sampleBlogPosts = [
  {
    title: "Building Modern Web Applications with React and TypeScript",
    excerpt: "Learn how to create scalable, type-safe web applications using React 18 and TypeScript best practices.",
    content: `# Building Modern Web Applications with React and TypeScript

React and TypeScript have become the go-to combination for building modern web applications. In this comprehensive guide, we'll explore how to leverage the power of both technologies to create robust, maintainable, and scalable applications.

## Why TypeScript with React?

TypeScript brings static typing to JavaScript, catching errors at compile-time rather than runtime. When combined with React's component-based architecture, you get:

- **Type Safety**: Catch errors before they reach production
- **Better IDE Support**: Improved autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Easier Refactoring**: Make changes with confidence

## Setting Up Your Project

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm install @types/react @types/react-dom
\`\`\`

## Component Best Practices

💡 **Tip**: Always define interfaces for your props and state to ensure type safety throughout your application.

\`\`\`typescript
interface UserProps {
  name: string;
  email: string;
  age?: number; // Optional property
}

const UserCard: React.FC<UserProps> = ({ name, email, age }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      {age && <p>Age: {age}</p>}
    </div>
  );
};
\`\`\`

## Advanced Patterns

### Custom Hooks with TypeScript

\`\`\`typescript
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(() => setError('Failed to fetch'))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
\`\`\`

> "TypeScript is JavaScript that scales." - TypeScript Team

## Performance Optimization

### Code Splitting

\`\`\`typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

## Conclusion

Combining React with TypeScript gives you the best of both worlds: React's declarative UI and TypeScript's type safety. Start with simple interfaces and gradually adopt more advanced patterns as your application grows.

Remember, the goal is not just to write TypeScript code, but to write better, more maintainable JavaScript applications.`,
    category: "Web Development",
    readTime: "8 min read",
    published: true
  },
  {
    title: "Mobile App Development: React Native vs Flutter",
    excerpt: "A comprehensive comparison between React Native and Flutter for cross-platform mobile development.",
    content: `# Mobile App Development: React Native vs Flutter

Choosing the right cross-platform framework is crucial for mobile app success. Let's dive deep into React Native vs Flutter to help you make an informed decision.

## Performance Comparison

### React Native
- Uses native components
- Better for CPU-intensive tasks
- Slower animations compared to Flutter

### Flutter
- Renders its own widgets
- 60fps smooth animations
- Better for graphics-intensive apps

\`\`\`dart
// Flutter Example
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter vs React Native'),
        ),
        body: Center(
          child: Text('Hello World'),
        ),
      ),
    );
  }
}
\`\`\`

## Development Experience

### React Native Pros
- JavaScript/TypeScript knowledge transfer
- Huge ecosystem
- Hot reloading

### Flutter Pros
- Single codebase for all platforms
- Excellent documentation
- Rich widget library

💡 **Tip**: Choose React Native if your team has web development experience. Choose Flutter if you need pixel-perfect UI and smooth animations.

## Community and Support

React Native has been around longer and has a larger community, but Flutter is growing rapidly with strong Google backing.

## Conclusion

Both frameworks are excellent choices. Consider your team's skills, project requirements, and long-term maintenance when making your decision.`,
    category: "Mobile Apps",
    readTime: "12 min read",
    published: true
  },
  {
    title: "Cloud Architecture: AWS vs Azure vs Google Cloud",
    excerpt: "Choosing the right cloud provider for your business needs and understanding key differences.",
    content: `# Cloud Architecture: AWS vs Azure vs Google Cloud

Selecting the right cloud provider is a critical decision that impacts your application's performance, cost, and scalability. Let's compare the three major cloud platforms.

## AWS (Amazon Web Services)

### Strengths
- Largest market share (32%)
- Most comprehensive service offerings
- Mature ecosystem
- Excellent documentation

### Popular Services
- EC2 (Virtual Servers)
- S3 (Storage)
- Lambda (Serverless)
- RDS (Databases)

## Microsoft Azure

### Strengths
- Strong enterprise integration
- Hybrid cloud capabilities
- Excellent for Windows environments
- Competitive pricing

### Popular Services
- Virtual Machines
- Blob Storage
- Azure Functions
- SQL Database

## Google Cloud Platform (GCP)

### Strengths
- Leading in Kubernetes and containers
- Strong in data analytics and ML
- Competitive pricing
- Excellent networking

### Popular Services
- Compute Engine
- Cloud Storage
- Cloud Functions
- BigQuery

⚠️ **Warning**: Consider vendor lock-in when choosing a cloud provider. Multi-cloud strategies can mitigate this risk.

## Pricing Comparison

All three providers offer pay-as-you-go pricing, but costs can vary significantly based on your usage patterns and specific services.

## Making the Right Choice

Consider these factors:
- **Team expertise**: What platforms does your team know?
- **Application requirements**: Specific services needed?
- **Compliance requirements**: Data residency and regulations
- **Budget**: Total cost of ownership

> "The best cloud provider is the one that meets your specific requirements and constraints." - Cloud Architecture Best Practices

## Conclusion

Each cloud provider has its strengths. AWS leads in market share and service breadth, Azure excels in enterprise integration, and GCP shines in containers and data analytics. Choose based on your specific needs.`,
    category: "Cloud",
    readTime: "10 min read",
    published: true
  },
  {
    title: "From Monolith to Microservices: A Migration Guide",
    excerpt: "When and how to evolve your architecture as your product scales.",
    content: `# From Monolith to Microservices: A Migration Guide

As your application grows, you might face the decision: stick with monolith or migrate to microservices? This guide will help you make the right choice.

## What is a Monolith?

A monolithic application is built as a single, self-contained unit. All components are tightly coupled and deployed together.

### Pros
- Simple to develop initially
- Easy to test and debug
- Lower operational complexity
- Better performance for small apps

### Cons
- Scaling challenges
- Technology lock-in
- Deployment bottlenecks
- Team coordination issues

## What are Microservices?

Microservices break down applications into small, independent services that communicate via APIs.

### Pros
- Independent scaling
- Technology diversity
- Team autonomy
- Faster deployment cycles

### Cons
- Operational complexity
- Network latency
- Data consistency challenges
- Higher initial cost

## When to Migrate?

Consider migration when:
- Your team grows beyond 10-15 developers
- You need to scale different components independently
- Deployment cycles are becoming too slow
- Different teams need different technology stacks

💡 **Tip**: Don't migrate just because it's trendy. Migrate when you have concrete problems that microservices can solve.

## Migration Strategies

### 1. Strangler Fig Pattern
Gradually replace parts of the monolith with microservices.

\`\`\`mermaid
graph LR
    A[Monolith] --> B[API Gateway]
    B --> C[New Service]
    B --> A
\`\`\`

### 2. Database Decomposition
Split the database first, then the application logic.

### 3. Anti-Corruption Layer
Create a buffer between old and new systems.

## Best Practices

1. **Start Small**: Begin with non-critical services
2. **Invest in DevOps**: Automation is crucial
3. **Monitor Everything**: Observability is key
4. **Plan for Failure**: Services will fail

> "Microservices are not a silver bullet. They solve some problems but create others." - Martin Fowler

## Tools and Technologies

### Service Mesh
- Istio
- Linkerd
- Consul Connect

### API Gateway
- Kong
- Apigee
- AWS API Gateway

### Container Orchestration
- Kubernetes
- Docker Swarm
- ECS/AKS/GKE

## Conclusion

Microservices architecture can solve real scaling problems, but they come with significant complexity. Migrate gradually and invest in the necessary tooling and expertise.

Remember: The goal is not to use microservices, but to solve business problems effectively.`,
    category: "DevOps",
    readTime: "15 min read",
    published: true
  },
  {
    title: "UI/UX Design Trends for 2026",
    excerpt: "Latest design trends and how to implement them in your projects.",
    content: `# UI/UX Design Trends for 2026

Design trends evolve rapidly, and staying current is essential for creating engaging user experiences. Let's explore the key trends shaping 2026.

## 1. AI-Powered Design

Artificial intelligence is revolutionizing how we design:

- **Generative Design**: AI creating design variations
- **Personalization**: Dynamic interfaces based on user behavior
- **Accessibility**: AI-powered accessibility improvements

\`\`\`css
/* AI-generated responsive design */
.ai-responsive {
  --ai-optimized-spacing: calc(var(--base-spacing) * var(--ai-multiplier));
  padding: var(--ai-optimized-spacing);
}
\`\`\`

## 2. Neumorphism

The evolution of flat design, combining skeuomorphism and flat design principles.

### Implementation
\`\`\`css
.neumorphic {
  background: #e0e5ec;
  box-shadow: 
    9px 9px 16px #a3b1c6,
    -9px -9px 16px #ffffff;
}
\`\`\`

## 3. 3D Elements and Depth

Adding depth to interfaces creates more engaging experiences.

💡 **Tip**: Use 3D elements sparingly to avoid overwhelming users and maintain performance.

## 4. Dark Mode Evolution

Dark mode is no longer just an alternative—it's becoming the default for many applications.

### Best Practices
- Ensure sufficient contrast ratios
- Consider user context and environment
- Provide easy switching options

## 5. Micro-interactions

Small, meaningful animations that provide feedback:

- Button hover states
- Loading animations
- Success/error feedback
- Gesture responses

## 6. Voice User Interface (VUI)

Voice interfaces are becoming mainstream:

- Voice commands
- Screen readers
- Multimodal interactions

## 7. Inclusive Design

Designing for everyone:

- Accessibility first approach
- Cultural considerations
- Age-appropriate design
- Cognitive load management

> "Good design is obvious. Great design is transparent." - Joe Sparano

## Implementation Tips

1. **Performance First**: Beautiful design that's slow is bad design
2. **Test Continuously**: User testing throughout the process
3. **Iterate Quickly**: Don't wait for perfection
4. **Measure Success**: Use analytics to validate design decisions

## Tools and Resources

### Design Tools
- Figma
- Adobe XD
- Sketch
- Framer

### Prototyping
- Principle
- ProtoPie
- InVision

### Analytics
- Hotjar
- FullStory
- Google Analytics

## Conclusion

Stay informed about trends but prioritize user needs over trendy aesthetics. The best design solves real problems while creating delightful experiences.

Remember: Trends come and go, but good design principles are timeless.`,
    category: "UI/UX Design",
    readTime: "8 min read",
    published: true
  },
  {
    title: "Machine Learning in Web Development",
    excerpt: "How to integrate ML capabilities into modern web applications.",
    content: `# Machine Learning in Web Development

Machine learning is no longer just for data scientists. Web developers can now integrate ML capabilities directly into their applications using modern tools and frameworks.

## Getting Started with ML in the Browser

### TensorFlow.js

TensorFlow.js brings machine learning to JavaScript:

\`\`\`javascript
import * as tf from '@tensorflow/tfjs';

// Create a simple model
const model = tf.sequential({
  layers: [
    tf.layers.dense({inputShape: [4], units: 10, activation: 'relu'}),
    tf.layers.dense({units: 3, activation: 'softmax'})
  ]
});

// Make predictions
const prediction = model.predict(inputData);
\`\`\`

### Use Cases

1. **Image Recognition**: Upload and classify images
2. **Natural Language Processing**: Chatbots and sentiment analysis
3. **Recommendation Systems**: Personalized content
4. **Anomaly Detection**: Security and fraud detection

## Real-World Applications

### Smart Forms

Forms that adapt based on user input:

\`\`\`javascript
// Smart form validation
function validateEmail(email) {
  const model = await tf.loadLayersModel('/models/email-validator.json');
  const prediction = await model.predict(preprocessEmail(email));
  return prediction.dataSync()[0] > 0.8;
}
\`\`\`

### Personalized Content

Content that adapts to user behavior:

\`\`\`javascript
// Content recommendation engine
class ContentRecommender {
  constructor(userBehavior) {
    this.model = this.trainModel(userBehavior);
  }
  
  recommend(userProfile) {
    return this.model.predict(userProfile);
  }
}
\`\`\`

## Tools and Libraries

### Frontend ML Libraries
- **TensorFlow.js**: Google's ML framework
- **Brain.js**: Neural networks in JavaScript
- **ML5.js**: Friendly ML library
- **Synaptic**: Architecture-agnostic neural networks

### Backend Integration
- **Python APIs**: Connect to Python ML models
- **Cloud ML Services**: AWS, Google Cloud, Azure ML
- **Edge Computing**: Run ML closer to users

## Performance Considerations

ℹ️ **Info**: ML models can be resource-intensive. Consider these optimization strategies:

1. **Model Compression**: Reduce model size
2. **Lazy Loading**: Load models when needed
3. **Web Workers**: Run ML in background threads
4. **WebAssembly**: For compute-intensive tasks

## Best Practices

### Data Privacy
- Process sensitive data locally
- Use federated learning when possible
- Be transparent about data usage

### User Experience
- Provide fallbacks for ML features
- Show loading states for ML operations
- Handle errors gracefully

### Testing
- Test ML models with diverse data
- Monitor model performance
- Plan for model updates

> "The best ML is invisible ML." - UX Design Principle

## Future Trends

1. **WebAssembly ML**: Faster ML in browsers
2. **Edge AI**: Processing on devices
3. **AutoML**: Automated model creation
4. **Explainable AI**: Understanding model decisions

## Getting Started

1. **Learn the Basics**: Understand ML fundamentals
2. **Start Small**: Begin with simple projects
3. **Use Pre-trained Models**: Leverage existing models
4. **Experiment**: Try different approaches

## Resources

### Learning
- TensorFlow.js Tutorials
- ML5.js Examples
- Google ML Crash Course
- Fast.ai Courses

### Communities
- TensorFlow.js GitHub
- Stack Overflow
- Reddit r/MachineLearning
- Local meetups and conferences

## Conclusion

Machine learning is becoming an essential skill for web developers. Start small, experiment often, and focus on solving real user problems.

Remember: The goal is not to use ML for everything, but to enhance user experiences where it makes sense.`,
    category: "AI/ML",
    readTime: "12 min read",
    published: true
  }
];

async function seedBlog() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'admin@vtechsoft.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'VTechSoft Admin',
        email: 'admin@vtechsoft.com',
        password: 'admin123456',
        role: 'admin'
      });
      console.log('Created admin user');
    }

    // Clear existing blog posts
    await Blog.deleteMany({});
    console.log('Cleared existing blog posts');

    // Create sample blog posts
    const createdPosts = await Blog.create(
      sampleBlogPosts.map(post => ({
        ...post,
        author: adminUser._id
      }))
    );

    console.log(`Created ${createdPosts.length} blog posts`);
    
    // Populate author information
    await Blog.populate(createdPosts, { path: 'author', select: 'name email' });

    console.log('Sample blog posts created successfully!');
    console.log('Posts:', createdPosts.map(p => ({ title: p.title, category: p.category })));

  } catch (error) {
    console.error('Error seeding blog posts:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedBlog();
