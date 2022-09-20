package com.rfidaguent.RFIDConnect.RNModule

import android.Manifest
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.rfidaguent.Class.CPreferenceUtil
import com.rfidaguent.MainActivity
import com.rfidaguent.MainApplication
import com.rfidaguent.RFIDConnect.Class.CRFIDControl
import org.json.JSONObject

class RFIDConnectModule(val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var constants: MutableMap<String, Any> = HashMap()
    private var m_cRFIDControl = CRFIDControl(reactContext);
    private var arrayListDevice: MutableMap<String, String>? = null
    private var m_preferences : CPreferenceUtil? = CPreferenceUtil(reactContext)

    //React Native Module 필수 함수.
    override fun getName(): String {
        return "RFIDConnectModule"
    }

    override fun getConstants(): Map<String, Any>? {
        return constants
    }

    //블루투스 찾기
    @ReactMethod
    fun onSearchBluetooth() {
        m_cRFIDControl.setSearchBroadcast();
        getDiscoveryPermission()
        m_cRFIDControl.mBluetoothDevice!!.StartDiscovery();
        Log.d("onSearchBluetooth", "블루투스 찾기 시작")
        if(m_cRFIDControl.searchBluetooth)
        {
            Log.d("onSearchBluetooth", "블루투스 있음 ")

        }
    }

    //블루스를 다찾았을때 브로드 캐스트 종료하기 위해 Stop 함수 선언
    @ReactMethod
    fun onSearchStop() {
        m_cRFIDControl.mBluetoothDevice!!.StopDiscovery();
        m_cRFIDControl.DisSearchBroadcast();
    }

    //블루투스 연결
    @ReactMethod
    fun onDeviceConnect(macAddress: String, deviceName: String) {
        //연결 시작전 모든 핸들러 연결 제거
//        if( m_cRFIDControl.IsConnect()){
//            m_cRFIDControl.setDisconnect();
//            m_cRFIDControl.DisRFIDHandlerCallBack();
//            m_cRFIDControl.DisScannerHandlerCallBack();
//            m_cRFIDControl.DisSearchBroadcast();
//        }

            m_cRFIDControl.onDeviceConnect(macAddress, deviceName);

//            Log.d("onSearchBluetooth", "블루투스 연결" + macAddress + "," + deviceName)
//            if( m_cRFIDControl.IsConnect()){
//                m_cRFIDControl.setRFIDHandler();
//                m_cRFIDControl.setScanMode(0);
//            }

    }

    //블루투스 연결 해제
    @ReactMethod
    fun onDeviceDisConnect() {
        try {
            m_cRFIDControl.setDisconnect()
//            m_cRFIDControl.DisRFIDHandlerCallBack();
//            m_cRFIDControl.DisScannerHandlerCallBack();
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun setScanMode(mode: Int) {
        try {
            m_cRFIDControl.setScanMode(mode)
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    //RFID Handler 연결 하는 함수
    @ReactMethod
    fun setRFIDHandler(promise: Promise) {
        try {
            constants["isRFIDHandler"] = m_cRFIDControl.setRFIDHandler()
            promise.resolve(constants["isRFIDHandler"]);
        } catch (e: Exception) {
            promise.reject("Create Event Error", e);
        }
    }

    @ReactMethod
    fun DisRFIDHandler() {
        try {
            m_cRFIDControl.DisRFIDHandlerCallBack();
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }


    @ReactMethod
    fun setBarcodeHandler(promise: Promise) {
        try {
            constants["isBarcodeHandler"] = m_cRFIDControl.setBarcodeHandler();
            promise.resolve(constants["isBarcodeHandler"]);
        } catch (e: Exception) {
            promise.reject("Create Event Error", e);
        }
    }


    @ReactMethod
    fun DisBarcodeHandler() {
        try {
            m_cRFIDControl.DisScannerHandlerCallBack();
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    //블루투스를 담은 객제
    @ReactMethod
    fun getDeviceList() {
        arrayListDevice = m_cRFIDControl.getDeviceToList()
    }

    //블루투스를 찾았는지 확인 하는 함수.
    @ReactMethod
    fun getBLEIsSearch(promise: Promise) {
        try {
            var isSearch: Boolean = m_cRFIDControl.SearchBluetooth()
            promise.resolve(isSearch);
        } catch (e: Exception) {
            promise.reject("Create Event Error", e);
        }
    }

    //블루투수와 PDA가 연결이 되어있는지 확인 하는 함수.
    @ReactMethod
    fun getRFIDIsConnect(promise: Promise) {
        try {
            var rifidConnect: Boolean = m_cRFIDControl.IsConnect()
            promise.resolve(rifidConnect);
        } catch (e: Exception) {
            promise.reject("Create Event Error", e);
        }
    }

    //찾은 블루투스 이름, MAC주소 가져오는 함수.
    @ReactMethod
    fun getBluetoothDeviceName(promise: Promise) = try {
        val map = WritableNativeMap()
        for (key in arrayListDevice!!.keys) {
            val value = arrayListDevice!![key]
            map.putString(key, value);
        }
        constants["bluetooth"] = map
        if (arrayListDevice!!.count() == 0) {
            constants["bluetooth"] = "BLUETOOTH_NONE"
        }
        promise.resolve(constants["bluetooth"]);

    } catch (e: Exception) {
        promise.reject("Create Event Error", e);
    }

    //블루투스 옵션 설정값 가져오는 함수.
    @ReactMethod
    fun getDeviceConfigSetting(promise: Promise) {
        try {
            val getConfig: MutableMap<String, Any> = m_cRFIDControl.getDeviceConfig();

            val map = WritableNativeMap()
            for (key in getConfig.keys) {
                val value: Any = getConfig[key].toString();
                map.putString(key, value as String);
            }
            constants["config"] = map
            if (getConfig.count() == 0) {
                constants["config"] = "CONFIG_NONE"
            }

            promise.resolve(constants["config"]);
        } catch (e: Exception) {
            promise.reject("Create Event Error", e);
        }
    }

    @ReactMethod
    fun setBuzzerVol(devContinue: Int) {
        try {
            m_cRFIDControl.setBuzzerVol(devContinue)
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    fun setVibrator(devVibState: Int) {
        try {
            m_cRFIDControl.setVibrator(devVibState)
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    fun setReadMode(devContinue: Int) {
        try {
            m_cRFIDControl.setReadMode(devContinue)
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    fun setRadioPower(devRadio: Int) {
        try {
            m_cRFIDControl.setRadio(devRadio);
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    //블루투스 옵션 설정하는 함수
//    @ReactMethod
//    fun setDeviceConfigSetting(devJson: String) {
//        try {
//            val devInfo: JSONObject = JSONObject(devJson)
//            val devBuzzer = devInfo.getString("devBuzzer");
//            val devVibState = devInfo.getString("devVibState");
//            val devRadio = devInfo.getString("devRadio");
//            val devContinue = devInfo.getString("devContinue");
//            m_cRFIDControl.setDeviceConfig(devBuzzer, devVibState, devRadio, devContinue)
//        } catch (e: Exception) {
//            e.printStackTrace();
//        }
//    }

    @ReactMethod
    fun ToasttMessge(message: String?) {
        try {
            if (message != null) {
                m_cRFIDControl.ToastMessage(message)
            };
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    fun ModeVerify(promise: Promise) {
        try {
            var mode = m_cRFIDControl.ScanModeVerifiy();
            if (mode < 0)
                promise.reject("Create Event Error", mode.toString());
            constants["mode"] = mode
            promise.resolve(constants["mode"]);
        } catch (e: Exception) {
            promise.reject("Create Event Error", e);
        }
    }

    //블루투스 관리자 권한 열어주는 함수.
    fun getDiscoveryPermission() {
        val hasPermission =
            ActivityCompat.checkSelfPermission(
                reactContext,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
        if (hasPermission == PackageManager.PERMISSION_GRANTED) {
            m_cRFIDControl.mBluetoothDevice!!.StartDiscovery()
            return
        }
        ActivityCompat.requestPermissions(
            currentActivity!!,
            arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION),
            m_cRFIDControl.mBluetoothDevice!!.REQUEST_COARSE_LOCATION_PERMISSIONS
        )
    }


//        private fun test(message: String) {
//        reactContext
//            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
//            .emit("test", message)
//    }
}