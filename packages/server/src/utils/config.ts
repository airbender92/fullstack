// utils/config.ts
export const checkEnvVariables = () => {
  const requiredVariables = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  
  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  }
};