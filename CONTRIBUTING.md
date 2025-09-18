<img width="1440" height="122" alt="image" src="https://github.com/user-attachments/assets/b43352aa-df3c-4165-872d-6cbc6fbcf026" /># Contribute to the Papers Repository

We appreciate your interest in contributing to the `papers-codechef` repository! Please follow these guidelines to ensure a smooth and effective contribution process.

---

## Contribution ideas

If you're looking for ideas about what to work on, check out:

- Our [issues](https://github.com/CodeChefVIT/papers-codechef/issues) 

The best way to propose a change is to start a [discussion] (https://github.com/CodeChefVIT/papers-codechef/discussions) on our CodeChefVIT GitHub repository. Begin by creating a new issue, write a brief problem statement that clearly explains the issue you want to address, without tying it to any specific solution. It doesn’t need to be long or formal; just provide enough context to clearly understand the problem before discussing possible solutions.

---
### Cloning the repository
- **Fork** the repository.
- **Clone** the repository. All the PRs would be made from this clone.

### Set Up Your Local Environment

To get the project running, you need to set up your local environment:

- **Create a `.env` file:** Create a new file named `.env` and use the .env.example file to create your own .env file and put in your your own environment variables to make the project functional.
- **Install dependencies:** Run `pnpm i` in your terminal to install all necessary dependencies.
- **Checkout staging branch**: Run `git checkout staging` to switch branches.
- **Run the project:** Run `pnpm dev` to start the project.

---

## How to Contribute

Once your environment is set up, you're ready to start coding.

- **Create a new branch:** Use the command `git checkout -b yourName/featureName` to create a new branch for your work.
- **Make your changes:** Write the code to address the issue you were assigned.
- **Add changed files:** After making your changes, use `git add .` to add the modified files to Git tracking.
- **Commit your changes:** Use `git commit -m "feat: xyz"` to create a checkpoint for your work. Use a prefix that describes your changes. Common prefixes include:
  - `feat:` A new feature.
  - `fix:` A bug fix.
  - `docs:` Documentation changes.
  - `style:` Formatting or white-space changes that do not affect the code's meaning.
  - `refactor:` A code change that is not a bug fix or a new feature.
  - `perf:` A code change that improves performance.
  - `test:` Adding or correcting tests.
  - `build:` Changes affecting the build system or external dependencies.
  - `ci:` Changes to CI configuration files or scripts.
  - `chore:` Other changes that don't modify source or test files.
  - `revert:` Reverts a previous commit.
- **Push your changes:** Push your commits to your forked repository using `git push`.

---

### Submit a Pull Request

- **Open a Pull Request:** On the forked repository, open a pull request and set the **base branch** to `staging` to submit your changes for review.
- **Request a review:** Wait for a organization member to review your PR. Any new changes you push to your branch will be automatically attached to the PR.

---

## Mandatory PR contents

Please ensure that any Pull Request you make contains these things -

- Purpose and issue which the PR is made for.
- Before & after screenshots if your changes involve any visual adjustments (e.g. UI changes, layout tweaks).
- List of the major changes made in this PR.
- Mention of any bug fixes, known issues or follow-ups needed.

**Important:** Ensure no merge conflicts exist before making a PR and run `pnpm build` to check for build errors.

**AI Disclosure:** Disclose any AI assistance used while working on the PR. Clearly state the extent of AI involvement (for example, “used AI for documentation only”, “used AI to generate initial code” or "used AI for PR descriptions & responses"). 

**Note:** Trivial tab-completion (like single keywords or short phrases) does not need to be disclosed.

## Tips to improve the chances of your PR getting reviewed and merged

- Small, focused & incremental pull requests are much easier to review.
- Spend time explaining your changes in the pull request body.
- Low effort PRs, such as those that just re-arrange syntax, won't be merged without a compelling justification.
