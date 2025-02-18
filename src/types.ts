export interface InstagramStats {
    followers?: string;
    following?: string;
    posts?: string;
    likes?: string;
    comments?: string;
  }
  
  export interface FacebookStats {
    likes?: string;
    talking_about_this?: string;
  }
  
  export interface YouTubeStats {
    views?: string;
  }
  
  export interface TikTokStats {
    likes?: string;
    followers?: string;
  }
  
  export interface LinkedInStats {
    members?: string;
  }
  
  export interface SocialMediaStats {
    username: string,
    data: {
      Instagram?: InstagramStats;
      Facebook?: FacebookStats;
      YouTube?: YouTubeStats;
      TikTok?: TikTokStats;
      LinkedIn?: LinkedInStats;
    }
  }

  export abstract class Agent {
    protected readonly name: string;
    protected readonly role: string;
    protected readonly backstory: string;
    protected readonly goal: string;
  
    constructor(name: string, role: string, backstory: string, goal: string) {
      this.name = name;
      this.role = role;
      this.backstory = backstory;
      this.goal = goal;
    }
  
    getAgentInfo(): Record<string, string> {
      return {
        name: this.name,
        role: this.role,
        backstory: this.backstory,
        goal: this.goal,
      };
    }
  }
  