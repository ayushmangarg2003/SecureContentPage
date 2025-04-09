import React, { useState } from 'react';
import { Shield, Youtube, CheckCircle, XCircle, Lock, FileText, BookOpen } from 'lucide-react';

function App() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  
  // Sample MCQ questions
  const questions = [
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 'Paris'
    },
    {
      id: '2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correct: 'Mars'
    }
  ];

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Calculate score
  const getScore = () => {
    return questions.reduce((score, question) => {
      return score + (selectedAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
  };

  // Check if an answer is correct
  const isCorrect = (questionId: string, option: string) => {
    const question = questions.find(q => q.id === questionId);
    return question?.correct === option;
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 md:p-8"
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 'p' || e.key === 's' || e.key === 'c')) {
          e.preventDefault();
        }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-600">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Secure Content Viewer
          </h1>
          <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
            <Lock className="w-4 h-4 mr-1 text-blue-600" />
            Protected Content
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'video' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Youtube className="w-5 h-5 inline mr-2" />
              Video Content
            </button>
            <button 
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'pdf' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              PDF Document
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'quiz' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Quiz
            </button>
          </div>

          <div className="p-6">
            {/* YouTube Video Section */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <p className="font-medium">Note: This video content is protected and cannot be downloaded or shared.</p>
                </div>
              </div>
            )}

            {/* PDF Viewer Section */}
            {activeTab === 'pdf' && (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <iframe
                    className="w-full h-full"
                    src="/sample.pdf#toolbar=0"
                    title="PDF document"
                  ></iframe>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <p className="font-medium">Note: This PDF content is protected and cannot be printed or downloaded.</p>
                </div>
              </div>
            )}

            {/* MCQ Section */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Answer all questions to test your knowledge</h3>
                </div>
                
                <div className="space-y-8">
                  {questions.map((q) => (
                    <div key={q.id} className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-800 text-lg">{q.question}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((option) => (
                          <label
                            key={option}
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                              ${
                                selectedAnswers[q.id] === option
                                  ? submitted
                                    ? isCorrect(q.id, option)
                                      ? 'bg-green-50 border-green-500 ring-2 ring-green-200'
                                      : 'bg-red-50 border-red-500 ring-2 ring-red-200'
                                    : 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:bg-gray-100'
                              }
                              ${submitted ? 'cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option}
                              checked={selectedAnswers[q.id] === option}
                              onChange={() => !submitted && handleAnswerSelect(q.id, option)}
                              disabled={submitted}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 flex items-center gap-2 font-medium">
                              {option}
                              {submitted && isCorrect(q.id, option) && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                              {submitted && selectedAnswers[q.id] === option && !isCorrect(q.id, option) && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                      {submitted && selectedAnswers[q.id] !== q.correct && (
                        <div className="text-sm text-green-600 font-medium pl-4 mt-2">
                          Correct answer: {q.correct}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Button and Score */}
                <div className="mt-8">
                  {!submitted ? (
                    <button
                      onClick={handleSubmit}
                      disabled={Object.keys(selectedAnswers).length !== questions.length}
                      className={`w-full py-4 px-4 rounded-lg font-medium text-white transition-colors shadow-md
                        ${
                          Object.keys(selectedAnswers).length === questions.length
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="text-center bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
                      <p className="text-2xl font-bold mb-2">
                        Your Score: {getScore()} out of {questions.length}
                      </p>
                      <p className="text-gray-600 mb-4">
                        {getScore() === questions.length 
                          ? "Perfect score! Well done!" 
                          : "Keep practicing to improve your score."}
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setSelectedAnswers({});
                        }}
                        className="py-2 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          <p>© {new Date().getFullYear()} Secure Content Viewer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default App;