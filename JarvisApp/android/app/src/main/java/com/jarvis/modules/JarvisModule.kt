package com.jarvis.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.UiThreadUtil
import android.speech.SpeechRecognizer
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.content.Intent
import android.os.Bundle
import android.util.Log

class JarvisModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var speechRecognizer: SpeechRecognizer? = null
    private var speechPromise: Promise? = null

    override fun getName(): String {
        return "JarvisModule"
    }

    @ReactMethod
    fun initializeModel(modelPath: String, promise: Promise) {
        // LLM initialization removed for fresh start/diagnostic
        promise.resolve(true)
    }

    @ReactMethod
    fun generateResponse(prompt: String, promise: Promise) {
        promise.resolve("Diagnostic mode: System is functional.")
    }

    @ReactMethod
    fun startSpeechRecognition(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                if (speechRecognizer != null) {
                    speechRecognizer?.destroy()
                }

                speechPromise = promise

                val recognizer = SpeechRecognizer.createSpeechRecognizer(reactApplicationContext)
                speechRecognizer = recognizer

                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)
                }

                recognizer.setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        Log.d("JarvisModule", "onReadyForSpeech")
                    }
                    override fun onBeginningOfSpeech() {
                        Log.d("JarvisModule", "onBeginningOfSpeech")
                    }
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {
                        Log.d("JarvisModule", "onEndOfSpeech")
                    }
                    override fun onError(error: Int) {
                        val message = when (error) {
                            SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                            SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
                            SpeechRecognizer.ERROR_NETWORK -> "Network error"
                            SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                            SpeechRecognizer.ERROR_NO_MATCH -> "No speech detected"
                            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Speech recognition service is busy"
                            SpeechRecognizer.ERROR_SERVER -> "Server error"
                            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech input"
                            else -> "Speech recognition error"
                        }
                        Log.e("JarvisModule", "Speech recognition error: $message ($error)")
                        speechPromise?.reject("ERR_SPEECH", "$message ($error)")
                        speechPromise = null
                    }
                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (matches != null && matches.isNotEmpty()) {
                            speechPromise?.resolve(matches[0])
                        } else {
                            speechPromise?.reject("ERR_SPEECH", "No speech recognized")
                        }
                        speechPromise = null
                    }
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })

                recognizer.startListening(intent)
            } catch (e: Exception) {
                promise.reject("ERR_SPEECH_INIT", e.message)
            }
        }
    }

    @ReactMethod
    fun stopSpeechRecognition() {
        UiThreadUtil.runOnUiThread {
            try {
                speechRecognizer?.stopListening()
            } catch (e: Exception) {
                Log.e("JarvisModule", "Failed to stop speech recognizer: ${e.message}")
            }
        }
    }
}
