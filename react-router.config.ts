import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, //true
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
