# PowerShell script to create blog posts
$baseUrl = "http://localhost:5001"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2I2NmRjOGQ3MWRlZjYwZjNmY2Q1MiIsImlhdCI6MTc2OTY5NDk2OSwiZXhwIjoxNzcwMjk5NzY5fQ.rNYghEnGopEiozp8iFUsAvul_q0BAk6dyvjSqqP5hw0"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$blogPosts = @(
    @{
        title = "Building Modern Web Applications with React and TypeScript"
        excerpt = "Learn how to create scalable, type-safe web applications using React 18 and TypeScript best practices."
        content = @"
# Building Modern Web Applications with React and TypeScript

React and TypeScript have become the go-to combination for building modern web applications. In this comprehensive guide, we'll explore how to leverage the power of both technologies to create robust, maintainable, and scalable applications.

## Why TypeScript with React?

TypeScript brings static typing to JavaScript, catching errors at compile-time rather than runtime. When combined with React's component-based architecture, you get:

- **Type Safety**: Catch errors before they reach production
- **Better IDE Support**: Improved autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Easier Refactoring**: Make changes with confidence

## Setting Up Your Project

```bash
npx create-react-app my-app --template typescript
cd my-app
npm install @types/react @types/react-dom
```

## Component Best Practices

Always define interfaces for your props and state to ensure type safety throughout your application.

```typescript
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
```

## Conclusion

Combining React with TypeScript gives you the best of both worlds: React's declarative UI and TypeScript's type safety.
"@
        category = "Web Development"
        readTime = "8 min read"
        published = $true
    },
    @{
        title = "Mobile App Development: React Native vs Flutter"
        excerpt = "A comprehensive comparison between React Native and Flutter for cross-platform mobile development."
        content = @"
# Mobile App Development: React Native vs Flutter

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

## Development Experience

### React Native Pros
- JavaScript/TypeScript knowledge transfer
- Huge ecosystem
- Hot reloading

### Flutter Pros
- Single codebase for all platforms
- Excellent documentation
- Rich widget library

## Conclusion

Both frameworks are excellent choices. Consider your team's skills, project requirements, and long-term maintenance when making your decision.
"@
        category = "Mobile Apps"
        readTime = "12 min read"
        published = $true
    },
    @{
        title = "Cloud Architecture: AWS vs Azure vs Google Cloud"
        excerpt = "Choosing the right cloud provider for your business needs and understanding key differences."
        content = @"
# Cloud Architecture: AWS vs Azure vs Google Cloud

Selecting the right cloud provider is a critical decision that impacts your application's performance, cost, and scalability.

## AWS (Amazon Web Services)

### Strengths
- Largest market share (32%)
- Most comprehensive service offerings
- Mature ecosystem
- Excellent documentation

## Microsoft Azure

### Strengths
- Strong enterprise integration
- Hybrid cloud capabilities
- Excellent for Windows environments
- Competitive pricing

## Google Cloud Platform (GCP)

### Strengths
- Leading in Kubernetes and containers
- Strong in data analytics and ML
- Competitive pricing
- Excellent networking

## Conclusion

Each cloud provider has its strengths. AWS leads in market share and service breadth, Azure excels in enterprise integration, and GCP shines in containers and data analytics.
"@
        category = "Cloud"
        readTime = "10 min read"
        published = $true
    },
    @{
        title = "From Monolith to Microservices: A Migration Guide"
        excerpt = "When and how to evolve your architecture as your product scales."
        content = @"
# From Monolith to Microservices: A Migration Guide

As your application grows, you might face the decision: stick with monolith or migrate to microservices?

## What is a Monolith?

A monolithic application is built as a single, self-contained unit. All components are tightly coupled and deployed together.

### Pros
- Simple to develop initially
- Easy to test and debug
- Lower operational complexity

### Cons
- Scaling challenges
- Technology lock-in
- Deployment bottlenecks

## What are Microservices?

Microservices break down applications into small, independent services that communicate via APIs.

### Pros
- Independent scaling
- Technology diversity
- Team autonomy
- Faster deployment cycles

## When to Migrate?

Consider migration when:
- Your team grows beyond 10-15 developers
- You need to scale different components independently
- Deployment cycles are becoming too slow

## Conclusion

Microservices architecture can solve real scaling problems, but they come with significant complexity. Migrate gradually and invest in the necessary tooling and expertise.
"@
        category = "DevOps"
        readTime = "15 min read"
        published = $true
    },
    @{
        title = "UI/UX Design Trends for 2026"
        excerpt = "Latest design trends and how to implement them in your projects."
        content = @"
# UI/UX Design Trends for 2026

Design trends evolve rapidly, and staying current is essential for creating engaging user experiences.

## 1. AI-Powered Design

Artificial intelligence is revolutionizing how we design:
- Generative Design: AI creating design variations
- Personalization: Dynamic interfaces based on user behavior
- Accessibility: AI-powered accessibility improvements

## 2. Neumorphism

The evolution of flat design, combining skeuomorphism and flat design principles.

## 3. Dark Mode Evolution

Dark mode is no longer just an alternative—it's becoming the default for many applications.

## 4. Micro-interactions

Small, meaningful animations that provide feedback:
- Button hover states
- Loading animations
- Success/error feedback

## Conclusion

Stay informed about trends but prioritize user needs over trendy aesthetics. The best design solves real problems while creating delightful experiences.
"@
        category = "UI/UX Design"
        readTime = "8 min read"
        published = $true
    },
    @{
        title = "Machine Learning in Web Development"
        excerpt = "How to integrate ML capabilities into modern web applications."
        content = @"
# Machine Learning in Web Development

Machine learning is no longer just for data scientists. Web developers can now integrate ML capabilities directly into their applications.

## Getting Started with ML in the Browser

### TensorFlow.js

TensorFlow.js brings machine learning to JavaScript:

```javascript
import * as tf from '@tensorflow/tfjs';

// Create a simple model
const model = tf.sequential({
  layers: [
    tf.layers.dense({inputShape: [4], units: 10, activation: 'relu'}),
    tf.layers.dense({units: 3, activation: 'softmax'})
  ]
});
```

## Use Cases

1. **Image Recognition**: Upload and classify images
2. **Natural Language Processing**: Chatbots and sentiment analysis
3. **Recommendation Systems**: Personalized content
4. **Anomaly Detection**: Security and fraud detection

## Conclusion

Machine learning is becoming an essential skill for web developers. Start small, experiment often, and focus on solving real user problems.
"@
        category = "AI/ML"
        readTime = "12 min read"
        published = $true
    }
)

Write-Host "Creating blog posts..."

foreach ($post in $blogPosts) {
    try {
        $body = $post | ConvertTo-Json -Depth 10
        $response = Invoke-RestMethod -Uri "$baseUrl/api/blog" -Method POST -Headers $headers -Body $body
        Write-Host "✅ Created: $($post.title)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to create: $($post.title)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Blog posts creation completed!" -ForegroundColor Cyan
