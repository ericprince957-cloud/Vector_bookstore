import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Users, Lightbulb } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

const About: React.FC = () => {
  return (
    <>
      <SEOHead title="About Us — BookVault" description="Learn about BookVault and our mission to provide practical digital books for Nigerian learners and professionals." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About BookVault</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            BookVault is a digital bookstore focused on providing practical, actionable knowledge 
            through well-crafted ebooks. We believe that quality learning materials should be 
            accessible, affordable, and relevant to the Nigerian context.
          </p>
        </div>

        {/* Mission */}
        <div className="mt-16 grid sm:grid-cols-2 gap-8">
          <div className="p-6 bg-emerald-50 rounded-xl">
            <Target className="w-8 h-8 text-emerald-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              To make practical knowledge accessible to every Nigerian who wants to learn, grow, 
              and build. We create and curate digital books that address real challenges and 
              provide actionable solutions.
            </p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-xl">
            <Lightbulb className="w-8 h-8 text-emerald-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Our Approach</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Every book we offer is designed with a clear purpose: to help you develop a skill, 
              solve a problem, or achieve a goal. We focus on practical content over theory, 
              and real-world application over abstract concepts.
            </p>
          </div>
        </div>

        {/* Who it's for */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Who Our Books Are For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Students</h3>
                <p className="mt-1 text-sm text-gray-500">Looking to build skills beyond the classroom</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Young Professionals</h3>
                <p className="mt-1 text-sm text-gray-500">Seeking career growth and financial literacy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Entrepreneurs</h3>
                <p className="mt-1 text-sm text-gray-500">Building businesses in the digital economy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Lifelong Learners</h3>
                <p className="mt-1 text-sm text-gray-500">Anyone committed to continuous self-improvement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Cover</h2>
          <div className="flex flex-wrap gap-3">
            {['Technology', 'AI & Machine Learning', 'Programming', 'Personal Finance', 'Business', 'Entrepreneurship', 'Career Development', 'Digital Skills', 'Productivity', 'Student Life'].map((topic) => (
              <span key={topic} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gray-50 rounded-xl text-center">
          <BookOpen className="w-10 h-10 text-emerald-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Ready to Start Learning?</h2>
          <p className="mt-2 text-gray-600">Browse our collection and find your next practical read.</p>
          <Link
            to="/books"
            className="mt-6 inline-flex px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    </>
  );
};

export default About;
