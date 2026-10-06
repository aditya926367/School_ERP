const port = Number(process.env.PORT) || 5000;

const nodeEnv = process.env.NODE_ENV || "development";

export const env = {
  port,
  nodeEnv,
};