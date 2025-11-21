module.exports = {
  apps: [
    {
      name: 'budget-backend',
      script: 'index.js',
      cwd: '/path/to/BudgetServer',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
    },
  ],
};
