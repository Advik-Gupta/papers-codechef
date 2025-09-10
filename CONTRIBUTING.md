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
  
  <img width="1480" height="327" alt="image" src="https://github.com/user-attachments/assets/3df5e7e3-ebad-4598-b51f-0fa64f0f1cca" />
  
- **Create the fork:** When prompted, make sure the "Copy the `prod` branch only" option is unchecked.
  
  <img width="1376" height="685" alt="image" src="https://github.com/user-attachments/assets/035dc07b-3296-4706-8037-f03de90fdafb" />

---

### **3. Clone Your Fork**

After forking, you need to get the code onto your local machine.

- **Sync your fork:** Before you start, make sure your fork is up to date with the original `CodeChefVIT` repository.

<img width="1486" height="1025" alt="image" src="https://github.com/user-attachments/assets/61a1fb0d-9000-49c0-be8a-7fccce966963" />

- **Clone the repo:** Copy the URL of your fork to your clipboard.
- **Run `git clone {url}`:** This command will clone the repository. You can use either **HTTPS** (less secure, easier) or **SSH** (more secure, needs a `.ssh` file setup). If you're unsure which method to use, ask a board member for help.

<img width="1490" height="1045" alt="image" src="https://github.com/user-attachments/assets/49ff2344-25b1-49d2-bb96-8a9581b0c73a" />

---

### **4. Set Up Your Local Environment**

To get the project running, you'll need to set up your local environment.

- **Create a `.env` file:** Create a new file named `.env` and ask a board member for its contents.
- **Install dependencies:** Run `pnpm i` in your terminal to install all necessary dependencies.
- **Do git checkout staging** if you want to contribute during a major revamp that is going on. Ask a board which branch to take as a base, if unsure.
- **Run the project:** Run `pnpm dev` to start the project.

<img width="1600" height="969" alt="image" src="https://github.com/user-attachments/assets/74ef04d2-fb5e-4b80-b014-f9207fc01714" />

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

  <img width="1482" height="1052" alt="image" src="https://github.com/user-attachments/assets/b72f3735-5801-496b-a59b-6f184c39eaa6" />

- **Target the `staging` branch:** When creating the pull request, make sure you set the **base branch** to `staging`.
  
  <img width="1482" height="1052" alt="image" src="https://github.com/user-attachments/assets/7578cf06-160e-4965-9273-5b68e926911d" />

- **Request a review:** After creating the pull request, direct message a board member to review your PR. Any new changes you push to your branch will be automatically attached to the pull request.
