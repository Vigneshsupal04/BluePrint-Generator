export interface Feature {
  name: string;
  description: string;
}

export interface TechStack {
  category: string;
  recommendation: string;
  reason: string;
}

export interface Milestone {
  name: string;
  description: string;
  duration: string;
}

export interface UIDesignPrototype {
    concept: string;
    layout: string;
    colorPalette: string[];
}

export interface ProjectBlueprint {
  projectName: string;
  description: string;
  features: Feature[];
  techStack: TechStack[];
  milestones: Milestone[];
  uiDesignPrototype: UIDesignPrototype;
}