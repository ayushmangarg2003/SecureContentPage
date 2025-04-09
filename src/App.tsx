import React, { useState } from 'react';
import { Shield, Youtube, CheckCircle, XCircle } from 'lucide-react';

function App() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
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
      className="min-h-screen bg-gray-100 p-8"
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 'p' || e.key === 's' || e.key === 'c')) {
          e.preventDefault();
        }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Secure Content Viewer
          </h1>
          <div className="text-sm text-gray-500">Content is protected</div>
        </div>

        {/* YouTube Video Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            Video Content
          </h2>
          <div className="relative aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">PDF Document</h2>
          <div className="relative aspect-[4/3]">
            <iframe
              className="w-full h-full rounded-lg"
              src="/sample.pdf#toolbar=0"
              title="PDF document"
            ></iframe>
          </div>
        </div>

        {/* MCQ Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Quiz Questions</h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="space-y-4">
                <p className="font-medium text-gray-800">{q.question}</p>
                <div className="grid grid-cols-1 gap-3">
                  {q.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                        ${
                          selectedAnswers[q.id] === option
                            ? submitted
                              ? isCorrect(q.id, option)
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50 border-red-500'
                              : 'bg-blue-50 border-blue-500'
                            : 'border-gray-200 hover:bg-gray-50'
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
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 flex items-center gap-2">
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
              </div>
            ))}
          </div>

          {/* Submit Button and Score */}
          <div className="mt-8">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white
                  ${
                    Object.keys(selectedAnswers).length === questions.length
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Submit Answers
              </button>
            ) : (
              <div className="text-center">
                <p className="text-xl font-semibold">
                  Your Score: {getScore()} out of {questions.length}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="mt-4 py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;