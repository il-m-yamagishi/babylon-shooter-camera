import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'lib', 'shooterCamera.js'),
            name: 'ShooterCamera',
            fileName: 'shooterCamera',
        },
        rollupOptions: {
            external: [
                /\@babylonjs\/core.*/,
                /\@babylonjs\/gui.*/,
                "pepjs",
            ],
            output: {
                globals: {
                    "@babylonjs/core": "BABYLON",
                    "@babylonjs/gui": "BABYLON.GUI",
                },
            },
        },
    },
});
