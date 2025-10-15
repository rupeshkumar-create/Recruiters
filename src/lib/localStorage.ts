// Local Storage utility for Recruiters Directory
export interface Recruiter {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  linkedin: string;
  specialization: string;
  experience: string;
  location: string;
  bio: string;
  avatar: string;
  slug: string;
  featured: boolean;
  hidden?: boolean;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  submitterEmail?: string;
  rating?: number;
  placements?: number;
  votes?: number;
  upvotes?: number;
  downvotes?: number;
  created_at?: string;
  updated_at?: string;
}

// Legacy Tool interface for compatibility
export interface Tool extends Recruiter {
  url?: string;
  tagline?: string;
  content?: string;
  description?: string;
  categories?: string;
  logo?: string;
}

export interface Comment {
  id: string;
  tool_id: string;
  content: string;
  author_name: string;
  author_email: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  tool_id: string;
  event_type: string;
  metadata?: any;
  created_at: string;
}

// Storage keys
const STORAGE_KEYS = {
  RECRUITERS: 'recruiters_directory',
  TOOLS: 'recruiters_directory', // Legacy compatibility
  COMMENTS: 'recruiters_comments',
  CATEGORIES: 'recruiters_categories',
  ANALYTICS: 'recruiters_analytics',
  VOTES: 'recruiters_votes'
};

// Utility functions for localStorage operations
export class LocalStorageDB {
  // Generic get/set methods
  private static get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return [];
    }
  }

  private static set<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  // Recruiters operations
  static getRecruiters(): Recruiter[] {
    return this.get<Recruiter>(STORAGE_KEYS.RECRUITERS);
  }

  static setRecruiters(recruiters: Recruiter[]): void {
    this.set(STORAGE_KEYS.RECRUITERS, recruiters);
  }

  static addRecruiter(recruiter: Omit<Recruiter, 'id' | 'created_at' | 'updated_at'>): Recruiter {
    const recruiters = this.getRecruiters();
    const newRecruiter: Recruiter = {
      ...recruiter,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes: 0,
      upvotes: 0,
      downvotes: 0,
      rating: 4.5,
      placements: 0
    };
    recruiters.push(newRecruiter);
    this.setRecruiters(recruiters);
    return newRecruiter;
  }

  static updateRecruiter(id: string, updates: Partial<Recruiter>): Recruiter | null {
    const recruiters = this.getRecruiters();
    const index = recruiters.findIndex(recruiter => recruiter.id === id);
    if (index === -1) return null;
    
    recruiters[index] = {
      ...recruiters[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.setRecruiters(recruiters);
    return recruiters[index];
  }

  static deleteRecruiter(id: string): boolean {
    const recruiters = this.getRecruiters();
    const filteredRecruiters = recruiters.filter(recruiter => recruiter.id !== id);
    if (filteredRecruiters.length === recruiters.length) return false;
    this.setRecruiters(filteredRecruiters);
    return true;
  }

  static getRecruiterBySlug(slug: string): Recruiter | null {
    const recruiters = this.getRecruiters();
    return recruiters.find(recruiter => recruiter.slug === slug) || null;
  }

  // Legacy Tools operations for compatibility
  static getTools(): Tool[] {
    return this.getRecruiters();
  }

  static setTools(tools: Tool[]): void {
    this.setRecruiters(tools);
  }

  static addTool(tool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>): Tool {
    return this.addRecruiter(tool);
  }

  static updateTool(id: string, updates: Partial<Tool>): Tool | null {
    return this.updateRecruiter(id, updates);
  }

  static deleteTool(id: string): boolean {
    return this.deleteRecruiter(id);
  }

  static getToolBySlug(slug: string): Tool | null {
    return this.getRecruiterBySlug(slug);
  }

  // Comments operations
  static getComments(): Comment[] {
    return this.get<Comment>(STORAGE_KEYS.COMMENTS);
  }

  static getCommentsByToolId(toolId: string): Comment[] {
    return this.getComments().filter(comment => comment.tool_id === toolId);
  }

  static addComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    comments.push(newComment);
    this.set(STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  }

  // Categories operations
  static getCategories(): Category[] {
    return this.get<Category>(STORAGE_KEYS.CATEGORIES);
  }

  static addCategory(category: Omit<Category, 'id' | 'created_at'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    categories.push(newCategory);
    this.set(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  }

  // Analytics operations
  static addAnalyticsEvent(event: Omit<Analytics, 'id' | 'created_at'>): void {
    const analytics = this.get<Analytics>(STORAGE_KEYS.ANALYTICS);
    const newEvent: Analytics = {
      ...event,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    analytics.push(newEvent);
    this.set(STORAGE_KEYS.ANALYTICS, analytics);
  }

  static getAnalytics(): Analytics[] {
    return this.get<Analytics>(STORAGE_KEYS.ANALYTICS);
  }

  // Voting operations
  static addVote(toolId: string, voteType: 'up' | 'down'): void {
    const tools = this.getTools();
    const toolIndex = tools.findIndex(tool => tool.id === toolId);
    if (toolIndex === -1) return;

    const tool = tools[toolIndex];
    if (voteType === 'up') {
      tool.upvotes = (tool.upvotes || 0) + 1;
    } else {
      tool.downvotes = (tool.downvotes || 0) + 1;
    }
    tool.votes = (tool.upvotes || 0) - (tool.downvotes || 0);
    tool.updated_at = new Date().toISOString();

    this.setTools(tools);
    
    // Track analytics
    this.addAnalyticsEvent({
      tool_id: toolId,
      event_type: `vote_${voteType}`,
      metadata: { voteType }
    });
  }

  // Initialize with default data
  static initializeDefaultData(): void {
    // Only initialize if no data exists
    if (this.getRecruiters().length === 0) {
      // Import default recruiters from data.ts
      import('./data').then(({ csvRecruiters }) => {
        this.setRecruiters(csvRecruiters);
      });
    }

    if (this.getCategories().length === 0) {
      const defaultCategories = [
        { name: 'Software Engineering', slug: 'software-engineering', description: 'Software developers and engineers' },
        { name: 'Executive Leadership', slug: 'executive-leadership', description: 'C-suite and executive positions' },
        { name: 'Healthcare & Life Sciences', slug: 'healthcare-life-sciences', description: 'Healthcare and biotech professionals' },
        { name: 'Finance & Banking', slug: 'finance-banking', description: 'Financial services professionals' },
        { name: 'Marketing & Creative', slug: 'marketing-creative', description: 'Marketing and creative professionals' },
        { name: 'Sales & Business Development', slug: 'sales-business-development', description: 'Sales and BD professionals' },
        { name: 'Human Resources', slug: 'human-resources', description: 'HR and people operations' },
        { name: 'Data Science & Analytics', slug: 'data-science-analytics', description: 'Data and analytics professionals' },
        { name: 'Manufacturing & Operations', slug: 'manufacturing-operations', description: 'Manufacturing and operations roles' },
        { name: 'Legal & Compliance', slug: 'legal-compliance', description: 'Legal and compliance professionals' },
        { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Information security professionals' },
        { name: 'Remote & Distributed Teams', slug: 'remote-distributed', description: 'Remote work specialists' }
      ];

      defaultCategories.forEach(category => this.addCategory(category));
    }
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    });
  }
}