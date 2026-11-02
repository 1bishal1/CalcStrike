/**
 * Question Service
 * Handles fetching questions from the Marc Conrad Banana API (https://marcconrad.com/uob/banana/api.php)
 * with robust error handling, network timeouts, answer sanitization (never expose answers to client),
 * and difficulty-tailored fallback math generation matching the CalcStrike curriculum.
 */

export class QuestionService {
  /**
   * Fetch a puzzle question from the official Banana API
   */
  async fetchBananaQuestion() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php', {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Banana API responded with status ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.question || data.solution === undefined || data.solution === null) {
        throw new Error('Invalid response structure from Banana API');
      }

      return {
        questionImage: data.question,
        questionText: null,
        answer: data.solution.toString().trim(),
        type: 'banana'
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Generate difficulty-aligned math questions matching the CalcStrike challenge tiers:
   * - Easy: Addition, Subtraction, Multiplication, Simple division, Number patterns (40s)
   * - Medium: Fractions, Percentages, Negative numbers, Basic algebra (e.g., 3x + 5 = 20) (30s)
   * - Difficult: Quadratic equations, Exponents, Roots, Multi-step algebra (20s)
   */
  generateQuestion(difficulty = 'easy') {
    const diff = (difficulty || 'easy').toLowerCase();

    if (diff === 'medium') {
      const kind = Math.floor(Math.random() * 4);
      if (kind === 0) {
        // Basic linear algebra: ax + b = c  => x = (c - b) / a
        const a = Math.floor(Math.random() * 5) + 2;
        const x = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const c = a * x + b;
        return {
          questionImage: null,
          questionText: `${a}x + ${b} = ${c}\nx = ?`,
          answer: x.toString(),
          type: 'math'
        };
      } else if (kind === 1) {
        // Percentage: What is P% of N?
        const p = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
        const mult = Math.floor(Math.random() * 10) + 1;
        const n = (100 / p) * mult * 2;
        const ans = (p / 100) * n;
        return {
          questionImage: null,
          questionText: `${p}% of ${n} = ?`,
          answer: ans.toString(),
          type: 'math'
        };
      } else if (kind === 2) {
        // Negative numbers: a - b or -a + b
        const a = Math.floor(Math.random() * 25) + 5;
        const b = Math.floor(Math.random() * 30) + 10;
        const ans = a - b;
        return {
          questionImage: null,
          questionText: `${a} - ${b} = ?`,
          answer: ans.toString(),
          type: 'math'
        };
      } else {
        // Order of operations: a + b * c
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 8) + 2;
        const ans = a + b * c;
        return {
          questionImage: null,
          questionText: `${a} + ${b} × ${c} = ?`,
          answer: ans.toString(),
          type: 'math'
        };
      }
    }

    if (diff === 'difficult' || diff === 'hard') {
      const kind = Math.floor(Math.random() * 4);
      if (kind === 0) {
        // Simple quadratic: x² - k = 0 (positive root)
        const x = Math.floor(Math.random() * 9) + 2;
        const k = x * x;
        return {
          questionImage: null,
          questionText: `x² - ${k} = 0  (x > 0)\nx = ?`,
          answer: x.toString(),
          type: 'math'
        };
      } else if (kind === 1) {
        // Exponents: base^exp
        const base = Math.floor(Math.random() * 5) + 2;
        const exp = base <= 3 ? 3 : 2;
        const ans = Math.pow(base, exp);
        return {
          questionImage: null,
          questionText: `${base}^${exp} = ?`,
          answer: ans.toString(),
          type: 'math'
        };
      } else if (kind === 2) {
        // Multi-step algebra: a(x + b) = c
        const a = Math.floor(Math.random() * 4) + 2;
        const x = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = a * (x + b);
        return {
          questionImage: null,
          questionText: `${a}(x + ${b}) = ${c}\nx = ?`,
          answer: x.toString(),
          type: 'math'
        };
      } else {
        // Square root: √N + k
        const root = Math.floor(Math.random() * 12) + 3;
        const n = root * root;
        const k = Math.floor(Math.random() * 15) + 1;
        const ans = root + k;
        return {
          questionImage: null,
          questionText: `√${n} + ${k} = ?`,
          answer: ans.toString(),
          type: 'math'
        };
      }
    }

    // Easy tier: arithmetic & patterns
    const kind = Math.floor(Math.random() * 4);
    if (kind === 0) {
      const a = Math.floor(Math.random() * 40) + 5;
      const b = Math.floor(Math.random() * 40) + 5;
      return {
        questionImage: null,
        questionText: `${a} + ${b} = ?`,
        answer: (a + b).toString(),
        type: 'math'
      };
    } else if (kind === 1) {
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * a) + 1;
      return {
        questionImage: null,
        questionText: `${a} - ${b} = ?`,
        answer: (a - b).toString(),
        type: 'math'
      };
    } else if (kind === 2) {
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      return {
        questionImage: null,
        questionText: `${a} × ${b} = ?`,
        answer: (a * b).toString(),
        type: 'math'
      };
    } else {
      const b = Math.floor(Math.random() * 9) + 2;
      const ans = Math.floor(Math.random() * 9) + 1;
      const a = b * ans;
      return {
        questionImage: null,
        questionText: `${a} ÷ ${b} = ?`,
        answer: ans.toString(),
        type: 'math'
      };
    }
  }

  /**
   * Retrieves a question for a game session.
   * Attempts the Banana API first. If network is unavailable or times out,
   * cleanly falls back to procedural curriculum questions so the game is always playable.
   */
  async getQuestion(difficulty = 'easy') {
    try {
      return await this.fetchBananaQuestion();
    } catch (err) {
      console.warn('Banana API unavailable, using fallback question generator:', err.message);
      return this.generateQuestion(difficulty);
    }
  }

  /**
   * Sanitizes question object for the client.
   * Crucial: NEVER send the solution/answer to the browser!
   */
  sanitizeForClient(question, difficulty = 'easy') {
    const diff = (difficulty || 'easy').toLowerCase();
    const timerSeconds = diff === 'difficult' ? 20 : diff === 'medium' ? 30 : 40;

    return {
      questionImage: question.questionImage || null,
      questionText: question.questionText || null,
      type: question.type || 'banana',
      timerSeconds
    };
  }
}

export default new QuestionService();
