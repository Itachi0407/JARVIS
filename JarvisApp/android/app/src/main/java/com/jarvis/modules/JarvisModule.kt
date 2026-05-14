package com.jarvis.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions
import java.io.File

class JarvisModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var llmInference: LlmInference? = null

    override fun getName(): String {
        return "JarvisModule"
    }

    @ReactMethod
    fun initializeModel(modelPath: String, promise: Promise) {
        try {
            val options = LlmInferenceOptions.builder()
                .setModelPath(modelPath)
                .setMaxTokens(512)
                .setTopK(40)
                .setTemperature(0.7f)
                .setRandomSeed(101)
                .build()

            llmInference = LlmInference.createFromOptions(reactApplicationContext, options)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_LLM_INIT", e.message)
        }
    }

    @ReactMethod
    fun generateResponse(prompt: String, promise: Promise) {
        val inference = llmInference
        if (inference == null) {
            promise.reject("ERR_LLM_NOT_INIT", "Model is not initialized")
            return
        }

        try {
            // Asynchronous generation
            val result = inference.generateResponse(prompt)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERR_LLM_GEN", e.message)
        }
    }
}
