package com.rfidaguent

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView
import org.devio.rn.splashscreen.SplashScreen


class MainActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String? {
        return "RFIDAgent"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate? {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun createRootView(): ReactRootView {
                return RNGestureHandlerEnabledRootView(this@MainActivity)
            }
        }
    }
}