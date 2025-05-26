import { Post } from '../types';

// Sample posts data
export const posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to Atlantic Dunes Blog',
    slug: 'welcome-to-atlantic-dunes-blog',
    content: `# Welcome to Atlantic Dunes Blog

This is our first blog post! We're excited to share our thoughts and experiences with you.

## What to Expect

- Technology insights
- Travel adventures
- Lifestyle tips
- Food reviews

Stay tuned for more content!`,
    excerpt: 'Welcome to our blog! We\'re excited to share our journey with you.',
    category: 'Lifestyle',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    published: true
  },
  {
    id: '2',
    title: 'The Future of Web Development',
    slug: 'future-of-web-development',
    content: `# The Future of Web Development

Web development is rapidly evolving with new frameworks and technologies emerging constantly.

## Key Trends

1. **Server Components**: React Server Components are changing how we think about rendering
2. **Edge Computing**: Moving computation closer to users
3. **AI Integration**: Incorporating AI into development workflows

The future looks bright for web developers!`,
    excerpt: 'Exploring the latest trends in web development and what the future holds.',
    category: 'Technology',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    published: true
  },
  {
    id: '3',
    title: 'Hidden Gems of Coastal Portugal',
    slug: 'hidden-gems-coastal-portugal',
    content: `# Hidden Gems of Coastal Portugal

Portugal's coastline offers some of Europe's most stunning and undiscovered beaches.

## Must-Visit Locations

- **Praia da Marinha**: Crystal clear waters and dramatic cliffs
- **Benagil Cave**: Famous sea cave accessible by kayak
- **Costa Nova**: Colorful striped houses by the sea

Each location offers unique experiences and breathtaking views.`,
    excerpt: 'Discover the most beautiful hidden beaches and coastal towns in Portugal.',
    category: 'Travel',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    published: true
  },
  {
    id: '4',
    title: 'Mastering the Art of Sourdough',
    slug: 'mastering-art-of-sourdough',
    content: `# Mastering the Art of Sourdough

Creating the perfect sourdough bread is both science and art. Here's your complete guide.

## Getting Started

1. **Creating Your Starter**: Mix equal parts flour and water
2. **Feeding Schedule**: Regular feeding for healthy cultures
3. **Temperature Control**: Maintain consistent environment

## The Perfect Loaf

- Autolyse for better gluten development
- Proper folding techniques
- Patience during fermentation

The result is worth every moment of effort!`,
    excerpt: 'Learn the secrets to creating perfect sourdough bread from scratch.',
    category: 'Food',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    published: true
  },
  {
    id: '5',
    title: 'Building Scalable React Applications',
    slug: 'building-scalable-react-applications',
    content: `# Building Scalable React Applications

As your React application grows, maintaining clean and scalable code becomes crucial.

## Key Principles

1. **Component Composition**: Build reusable components
2. **State Management**: Choose the right state solution
3. **Performance Optimization**: Prevent unnecessary re-renders
4. **Testing Strategy**: Comprehensive test coverage

## Best Practices

- Use TypeScript for better developer experience
- Implement proper error boundaries
- Optimize bundle size with code splitting
- Follow consistent coding standards

Planning for scale from the beginning saves countless hours later.`,
    excerpt: 'Essential strategies for building React applications that scale with your team and users.',
    category: 'Technology',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    published: false // Draft post
  }
];
