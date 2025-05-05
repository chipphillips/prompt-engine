# Create Template Feature - Implementation Plan

## Overview of Prompt Engine

The Prompt Engine is a tool designed for Constructiv AI to help construction industry professionals create, manage, and utilize AI prompts effectively. The application allows users to:

1. Select from pre-defined templates
2. Fill in variables to customize the prompts
3. Generate AI responses based on these prompts
4. Log and track prompt usage

We've recently completed UI improvements to enhance the user experience, including:
- Converting from Pages Router to App Router format
- Adding a sticky header with "New Template" and "Show Prompt Logs" buttons
- Fixing environment status display
- Enhancing prompt logs display

## The "Create Template" Feature

The Create Template feature will extend the functionality of Prompt Engine by allowing users to:
- Create new prompt templates from scratch
- Convert existing prompts into reusable templates with AI assistance
- Manage templates with version control
- View and edit templates from a template library

## User Requirements

1. Users should be able to paste in an existing prompt and have AI convert it into a reusable template
2. AI should identify variables that the user has indicated or suggest new variables
3. Users should have the option to reuse/modify existing templates
4. Templates should be saved and accessible through a template library
5. Users should be able to quickly copy or edit templates from the library
6. Templates should have version control with version indicators in the UI
7. Users should receive warnings if using an outdated template version
8. Users should be able to refresh to the latest template version

## Implementation Plan

### Phase 1: UI Components for Template Creation

1. **Create a Template Form Modal**
   - Design a modal dialog triggered by the "New Template" button
   - Include fields for:
     - Template name
     - Description/purpose
     - Category/tags
     - Content (the prompt template)
   - Add options to:
     - Create from scratch
     - Create from existing text (with AI assistance)
     - Clone from existing template

2. **Variable Identification Interface**
   - Design UI for highlighting and defining variables in the prompt text
   - Create interactive elements for users to:
     - Approve AI-suggested variables
     - Manually add variables
     - Edit variable names and descriptions
     - Preview how the template will look with variables

3. **Template Library View**
   - Create a browsable library interface showing all templates
   - Include search and filter functionality
   - Display template metadata (name, description, creation date, version)
   - Add options to copy, edit, or use templates

### Phase 2: Backend Functionality

1. **Database Schema Updates**
   - Enhance the prompt_templates table to include:
     - Version information (version number, created_at)
     - Parent template reference (for version tracking)
     - Metadata (creator, category, tags)
   - Create necessary indexes for performance

2. **API Routes for Template Management**
   - `/api/templates` - GET, POST, PUT endpoints for template CRUD operations
   - `/api/templates/analyze` - POST endpoint for AI analysis of template text
   - `/api/templates/versions` - GET endpoint for template version history

3. **AI Integration for Template Analysis**
   - Develop prompt for OpenAI to identify variables in user text
   - Create logic to:
     - Parse AI suggestions
     - Format variables consistently
     - Generate template preview with variables

4. **Version Control System**
   - Implement version tracking for templates
   - Create notification system for outdated templates
   - Build version comparison functionality
   - Develop template update/refresh mechanism

### Phase 3: User Experience Enhancement

1. **Guided Creation Process**
   - Step-by-step wizard for template creation
   - Contextual help and examples
   - Preview at each step

2. **Template Validation**
   - Syntax checking for Handlebars templates
   - Variable consistency validation
   - Required field validation

3. **Error Handling**
   - User-friendly error messages
   - Recovery options for failed operations
   - Autosave functionality

4. **Template Usage Metrics**
   - Track template usage statistics
   - Show popularity/effectiveness metrics
   - Highlight commonly used templates

## Technical Implementation Details

### Data Structures

**Template Object:**
```typescript
interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;  // Contains the template with variables
  category: string;
  tags: string[];
  variables: TemplateVariable[];
  version: number;
  parent_id?: string;  // Reference to parent template if this is a new version
  created_at: string;
  updated_at: string;
  created_by: string;
  usage_count: number;
}

interface TemplateVariable {
  name: string;
  description: string;
  default_value?: string;
  required: boolean;
  type: 'text' | 'select' | 'number';
  options?: string[];  // For select type variables
}
```

### API Endpoints

1. **GET /api/templates**
   - List all templates with pagination, sorting, and filtering

2. **GET /api/templates/:id**
   - Get a specific template by ID
   - Include option to get latest version (`?latest=true`)

3. **POST /api/templates**
   - Create a new template
   - Return the created template with ID

4. **PUT /api/templates/:id**
   - Update an existing template
   - Option to create new version (`?new_version=true`)

5. **DELETE /api/templates/:id**
   - Mark a template as deleted (soft delete)

6. **POST /api/templates/analyze**
   - Send prompt text for AI analysis
   - Return suggested variables and formatted template

7. **GET /api/templates/:id/versions**
   - Get version history of a template

### AI Processing Flow

1. User pastes text into the template creation form
2. System sends text to `/api/templates/analyze` endpoint
3. Backend processes text with OpenAI:
   ```
   You are an AI assistant specialized in converting prompts into reusable templates.
   Analyze the following text and identify variables that could be parameterized.
   Return a JSON object with:
   1. The template with variables in Handlebars format ({{variable_name}})
   2. A list of identified variables with suggested names and descriptions
   3. Any additional suggestions for improving the template
   ```
4. System presents the analyzed template to the user
5. User confirms or modifies the variables
6. Template is saved to the database

## Implementation Sequence

### Week 1: Foundation and Basic UI

1. Set up database schema changes for templates and versions
2. Create basic modal UI for template creation
3. Implement template creation form with manual variable definition
4. Build simple template listing page

### Week 2: AI Integration and Enhanced UI

1. Implement AI analysis endpoint for template text
2. Create variable identification and highlighting interface
3. Develop template preview functionality
4. Add basic version control system

### Week 3: Complete UI and Testing

1. Implement template library with search and filtering
2. Add version control UI with update notifications
3. Create guided template creation wizard
4. Implement template validation and error handling

### Week 4: Polish and Deployment

1. Add usage metrics and analytics
2. Optimize performance and UX
3. Conduct user testing and gather feedback
4. Deploy the feature with documentation

## Success Criteria

- Users can create templates from scratch or existing text
- AI successfully identifies variables in prompt text
- Templates are properly versioned and users are notified of updates
- Template library provides easy access to all templates
- Users can efficiently find, use, and modify templates

## Potential Challenges and Solutions

1. **AI Variable Identification Accuracy**
   - Challenge: AI might not correctly identify all appropriate variables
   - Solution: Allow easy manual override and editing, learn from user corrections

2. **Version Control Complexity**
   - Challenge: Managing versions without confusing users
   - Solution: Simple visual indicators and clear update messages

3. **Template Organization**
   - Challenge: As template library grows, finding templates becomes difficult
   - Solution: Robust search, filtering, tags, and categories

4. **Performance**
   - Challenge: AI analysis might be slow for large templates
   - Solution: Implement loading states, background processing, and caching

This plan provides a comprehensive approach to implementing the Create Template feature, focusing on user-friendly interactions, AI assistance, and robust template management with version control. 