import { useState } from 'react';

function QuestionCard({ question, onSubmit, disabled }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid rgba(114, 142, 109, 0.35)',
      padding: '1.75rem',
      borderRadius: '14px',
      maxWidth: '560px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {question?.questionImage ? (
          <img
            src={question.questionImage}
            alt="Banana API Equation"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            color: '#0B120A',
            fontSize: '1.6rem',
            fontWeight: 700,
            whiteSpace: 'pre-line',
            fontFamily: 'Courier New, monospace'
          }}>
            {question?.questionText || question?.question || question}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
          disabled={disabled}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--color-cream)',
            fontSize: '1rem',
            outline: 'none'
          }}
          autoFocus
        />
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          style={{
            padding: '0.75rem 1.75rem',
            backgroundColor: 'var(--color-gold)',
            color: '#0B120A',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default QuestionCard;
