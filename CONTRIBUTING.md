### **How to Contribute to the Papers Repository**

We appreciate your interest in contributing to the `papers-codechef` repository! Please follow these guidelines to ensure a smooth and effective contribution process.

---

### **1. Get an Issue Assigned**

All contributions must be tied to an issue. Go to the issues page at `https://github.com/CodeChefVIT/papers-codechef/issues`
You can either ask a board member to assign you an existing issue or create a new issue and ask a board member to assign it to you.

---

### **2. Fork the Repository**

To start working, you need to create your own copy of the repository.

- **Fork the repo:** Navigate to `https://github.com/CodeChefVIT/papers-codechef` and click the "Fork" button to create a copy of the repository on your account. This allows you to freely experiment with changes without affecting the original project.
- **Create the fork:** When prompted, make sure the "Copy the `prod` branch only" option is unchecked.

---

### **3. Clone Your Fork**

After forking, you need to get the code onto your local machine.

- **Clone the repo:** Copy the URL of your fork to your clipboard.
- **Run `git clone {url}`:** This command will clone the repository. You can use either **HTTPS** (less secure, easier) or **SSH** (more secure, needs a `.ssh` file setup). If you're unsure which method to use, ask a board member for help.
- **Sync your fork:** Before you start, make sure your fork is up to date with the original `CodeChefVIT` repository.

---

### **4. Set Up Your Local Environment**

To get the project running, you'll need to set up your local environment.

- **Create a `.env` file:** Create a new file named `.env` and ask a board member for its contents.
- **Install dependencies:** Run `pnpm i` in your terminal to install all necessary dependencies.
- **Run the project:** Run `pnpm dev` to start the project.

---

### **5. Work on Your Code**

Once your environment is set up, you're ready to start coding.

- **Create a new branch:** Use the command `git checkout -b yourName/featureName` to create a new branch for your work.
- **Make your changes:** Write the code to address the issue you were assigned.
- **Add changed files:** After making your changes, use `git add` to add the modified files to Git tracking.
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

### **6. Submit a Pull Request**

- **Open a Pull Request:** On your GitHub page for the forked repository, you will see a button to "Open pull request" since your branch is ahead of the upstream. Click this to begin the process.
- **Target the `staging` branch:** When creating the pull request, make sure you set the **base branch** to `staging`.
- **Request a review:** After creating the pull request, direct message a board member to review your PR. Any new changes you push to your branch will be automatically attached to the pull request.
