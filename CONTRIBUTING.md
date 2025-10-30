# Contributing to DNA Lang Mobile IDE

Thank you for your interest in contributing to DNA Lang Mobile IDE! This project is powered by Red Hat OpenShift and follows open source best practices.

## 🤝 Code of Conduct

This project adheres to Red Hat's open source code of conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- (Optional) Red Hat OpenShift CLI (`oc`)
- (Optional) Access to Red Hat OpenShift Dev Spaces

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dna-lang-mobile-ide.git
   cd dna-lang-mobile-ide
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/dnalang/dna-lang-mobile-ide.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 2. Make Your Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run type checker
npm run typecheck

# Run tests
npm test

# Build to ensure no build errors
npm run build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new DNA sequence visualization"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build process or auxiliary tool changes

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template
5. Submit for review

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use functional components with hooks

### React

- Use functional components
- Use hooks for state and effects
- Keep components small and focused
- Use PatternFly components when available

### CSS

- Use CSS modules or styled components
- Follow PatternFly design guidelines
- Ensure mobile responsiveness
- Use Red Hat fonts and colors

### Naming Conventions

- Components: PascalCase (`Editor.tsx`)
- Hooks: camelCase with 'use' prefix (`useStore.ts`)
- Utilities: camelCase (`executeDNALang.ts`)
- Constants: UPPER_SNAKE_CASE

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage
- Test both happy paths and edge cases
- Use descriptive test names

```typescript
describe('DNA Lang Executor', () => {
  it('should execute valid DNA Lang code', async () => {
    const result = await executeDNALang('console.log("test")');
    expect(result.output).toContain('test');
    expect(result.errors).toHaveLength(0);
  });
});
```

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update CHANGELOG.md
- Include examples for new features

## 🔴 Red Hat OpenShift Integration

When making changes that affect OpenShift deployment:

1. Update `devfile.yaml` if needed
2. Test with OpenShift Dev Spaces
3. Update `.openshift/` configurations
4. Document in README.md

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues
- Test on the latest version
- Gather detailed reproduction steps

### Bug Report Template

```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., iOS, Android, Windows]
- Browser: [e.g., Chrome, Safari]
- Version: [e.g., 1.0.0]
- OpenShift: [yes/no]
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why this feature would be useful

**Proposed Implementation**
How you think it could be implemented

**Alternatives Considered**
Other solutions you've thought about
```

## 🔍 Code Review Process

1. **Automated Checks** - CI/CD runs automatically
2. **Maintainer Review** - At least one maintainer approval
3. **Testing** - All tests must pass
4. **Documentation** - Docs must be updated
5. **Merge** - Squash and merge to main

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Part of the DNA Lang community

## 📞 Getting Help

- **GitHub Discussions** - Ask questions
- **GitHub Issues** - Report bugs
- **Red Hat Developer** - OpenShift resources

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.

---

Thank you for contributing to DNA Lang Mobile IDE! 🧬❤️
