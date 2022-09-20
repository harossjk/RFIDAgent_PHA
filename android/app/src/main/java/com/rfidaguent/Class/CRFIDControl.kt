package com.rfidaguent.RFIDConnect.Class

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.graphics.Typeface
import android.os.Handler
import android.os.HandlerThread
import android.os.Message
import android.util.Log
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.rfidaguent.Class.CScanHandler
import device.common.rfid.ModeOfInvent
import device.common.rfid.RFIDConst
import device.sdk.RFIDManager
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.lang.ref.WeakReference
import java.util.*
import kotlin.collections.HashMap


class CRFIDControl (private val reactContext: ReactApplicationContext) {
    val TAG = "CRFIDControl"
    private val DOTR3000_UHF_READER = "DOTR3"
    private val RF800_UHF_READER = "RF"

    var m_rfidManager: RFIDManager? = null
    var m_rfidHandler: CRFIDHandler? = null
    var m_scanHandler: CScanHandler? = null
    var connectedDeviceMacAddress = "-"
    var mBluetoothDevice : CBluetooth? = null
    private var isConnected = false
     var searchBluetooth =false
    private var arrayListDevice: MutableMap<String, String>? = null
    private var constants: MutableMap<String, Any> = HashMap()

    var _finish: Boolean = false
    private val searchReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            var deviceName: String? = "";
            if (BluetoothDevice.ACTION_FOUND == action) {
                val bluetoothDevice =
                    intent.getParcelableExtra<BluetoothDevice>(BluetoothDevice.EXTRA_DEVICE)
                if (bluetoothDevice!!.name != null) {
                    deviceName = bluetoothDevice.name.lowercase()
                    if (!deviceName.isEmpty()) {
                        if (deviceName.contains(DOTR3000_UHF_READER.lowercase())
                            || deviceName.contains(DOTR3000_UHF_READER.lowercase())
                            || deviceName.contains(RF800_UHF_READER.lowercase())
                        ) {
                            searchBluetooth= true;
                            addDeviceToTheList(bluetoothDevice)
                            Log.d("BroadcastReceiver", deviceName)
                        }
                    }
                    else
                    {
                        searchBluetooth= false;
                        Log.d("BroadcastReceiver", "bluetooth power on p")
                    }
                } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED == action) {
                    //Log.d("ReaderActivity", "ACTION_DISCOVERY_FINISHED");
                    _finish = true
                }
                else if (BluetoothDevice.ACTION_ACL_DISCONNECTED == action) {
                    Log.i(TAG, "BroadcastReceiver()-Bluetooth Disconnect ")
                }
            }
        }
    }

    init {
        this.arrayListDevice = mutableMapOf<String,String>()
        this.m_rfidManager = RFIDManager();
        this.mBluetoothDevice= CBluetooth(this.m_rfidManager!!)
        this.isConnected = false;
        this.connectedDeviceMacAddress = ""

        val handlerRFIDThread = HandlerThread("RFIDHandler")
        handlerRFIDThread.start();
        m_rfidHandler = CRFIDHandler(m_rfidManager!!, handlerRFIDThread.looper)
        m_rfidHandler!!.parent = this;

        val handlerScannerThread = HandlerThread("Scannerandler")
        handlerScannerThread.start();
        m_scanHandler = CScanHandler(reactContext ,handlerScannerThread.looper)
        m_scanHandler!!.parent= this
    }

    fun setSearchBroadcast(){
        var filter = IntentFilter()
        filter.addAction(BluetoothDevice.ACTION_FOUND)
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
        filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED)
        reactContext.registerReceiver(searchReceiver, filter)
    }

    fun DisSearchBroadcast() {
        reactContext.unregisterReceiver(searchReceiver)
    }

    //region #RFID
    fun setRFIDHandler():Boolean {
        //RFID handler set 할때 Scanner callback 과 broadcast 는 초기화
        this.m_rfidManager!!.SetResultType(RFIDConst.ResultType.RFID_RESULT_CALLBACK)
        var isCallBack :Boolean= m_rfidHandler!!.setRFIDHandlerCallback()
        //this.m_rfidManager!!.SetTriggerMode(0);
        return isCallBack
    }

    fun DisRFIDHandlerCallBack()
    {
        m_rfidHandler!!.DisRFIDHandlerCallBack()
    }
    //endregion

    //region #Barcode
    fun setBarcodeHandler():Boolean{
        //DisRFIDHandlerCallBack()

        var isCallBack :Boolean= m_scanHandler!!.setScannerHandlerCallback()

        //this.m_rfidManager!!.SetTriggerMode(1);
        return isCallBack
    }

    fun DisScannerBroadCast(){
        m_scanHandler!!.DisScannerBroadCast()
    }

    fun DisScannerHandlerCallBack(){
        m_scanHandler!!.DisScannerHandlerCallBack()
    }

    //endregion
    fun setConnect(deviceName: String?,macAddress: String? ) {

        this.connectedDeviceMacAddress = macAddress!!
        this.m_rfidManager?.ConnectBTDevice(macAddress, deviceName)

        this.isConnected = this.m_rfidManager!!.IsOpened();
        this.m_rfidHandler?.postDelayed({}, 10000)
    }


    fun setDisconnect() {
        this.isConnected = false
        this.m_rfidManager?.DisconnectBTDevice()
        this.m_rfidManager?.Close()
    }

    fun addDeviceToTheList(bluetoothDevice: BluetoothDevice){
        for(i in arrayListDevice!!){
            val map:MutableMap<String,String> = arrayListDevice as MutableMap<String, String>
            val deviceName = map[mBluetoothDevice!!.KEY_NAME]
            if(bluetoothDevice.name.equals(deviceName, ignoreCase = true))
            {
                return;
            }
        }
        arrayListDevice!!.put(bluetoothDevice.name, bluetoothDevice.address)
        if (isConnected){
            arrayListDevice!!.put(bluetoothDevice.name, bluetoothDevice.address+ " - Error")
        }
    }

    fun getDeviceToList(): MutableMap<String, String>? {
        this.m_rfidManager?.Open(1);
        return arrayListDevice
    }

    fun  IsConnect():Boolean{
        //블루투스가 연결이 되어 있는가?
        if(m_rfidManager!!.IsOpened())
        {
            isConnected =true
        }
        return isConnected;
    }

    fun SearchBluetooth():Boolean{
        return this.searchBluetooth;
    }

    fun setBuzzerVol (devBuzzer:Int){
        this.m_rfidManager!!.SetBuzzerVol(devBuzzer);
        Log.d(TAG, "setBuzzerVol" +devBuzzer.toString())
    }

    fun setVibrator(devVibState: Int) {
        this.m_rfidManager!!.SetVibState(devVibState);
        Log.d(TAG, "setVibrator" +devVibState.toString())
    }

    fun setReadMode(devContinue:Int) {
        val modeOf :ModeOfInvent =ModeOfInvent();
        modeOf.single= devContinue
        this.m_rfidManager!!.SetOperationMode(modeOf);

        Log.d(TAG, "setReadMode" +devContinue.toString())
    }

    fun setRadio(devRadio:Int) {
        this.m_rfidManager!!.SetTxPower(devRadio);
        Log.d(TAG, "setRadio" +devRadio.toString())
    }

    fun setDeviceConfig(devBuzzer: String, devVibState: String, devRadio: String, devContinue: String) {
        this.m_rfidManager!!.SetBuzzerVol(devBuzzer.toInt());
        this.m_rfidManager!!.SetVibState(devVibState.toInt());

        val modeOf :ModeOfInvent =ModeOfInvent();
        modeOf.single= devContinue.toInt();
        this.m_rfidManager!!.SetOperationMode(modeOf);
    }

    fun getDeviceConfig():MutableMap<String, Any> {
        return this.m_rfidHandler!!.getDeviceConfig();
    }

    fun onDeviceConnect(deviceName:String?, macAddress:String? ){

        Log.d("onDeviceConnect", "name :"+deviceName +", mac :"+macAddress)

        if(macAddress == null || deviceName == null)
            return;

        if(m_rfidManager!!.IsOpened())
        {
            Log.d("onDeviceConnect", "이미 연결됨?")
            setDisconnect();
        }
        else
        {
            setConnect(deviceName, macAddress);
            //m_rfidManager!!.Stop();
        }
    }

    fun ToastMessage(message: String)
    {
        val toast = Toast.makeText(
            reactContext,
            message, Toast.LENGTH_SHORT
        )



        val toastLayout = toast.getView() as ViewGroup
        val toastTV:TextView=  toastLayout.getChildAt(0) as TextView

        val greyFilter = PorterDuffColorFilter(Color.rgb(238,238,238), PorterDuff.Mode.MULTIPLY)
        toastLayout.getBackground().setColorFilter(greyFilter);

        toastTV.setTypeface(null,Typeface.BOLD);
        toastTV.setTextSize(18F)
        toastTV.setTextColor(Color.rgb(28,46,74))




        //toastLayout.setBackgroundColor(Color.rgb(249,249,249))

        //toastTV.setTextColor(Color.WHITE)
        //toastTV.setBackgroundColor(Color.BLACK)
        //toast.setGravity(Gravity.CENTER or Gravity.CENTER_HORIZONTAL, 0, 300)
        toast.show()
    }

    fun ScanModeVerifiy() :Int{
        var getCurrMode: Int = m_rfidManager!!.GetTriggerMode()
        if(getCurrMode < 0){
            m_rfidManager!!.SetTriggerMode(0);
            getCurrMode = m_rfidManager!!.GetTriggerMode()
        }

        Log.d("mode", "trigger mode : $getCurrMode")
        return getCurrMode;
    }

    fun setScanMode(mode:Int){
        m_rfidManager!!.SetTriggerMode(mode)
    }

    fun ReceiverScanData(sTag:String) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("ReceiverScanData", sTag)
        }
        catch (e:RuntimeException ) {
            e.printStackTrace();
        }
    }
    fun ReceiverScanStatuse(isRfidRunning:Boolean) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("ReceiverScanStatuse", isRfidRunning)
        }
        catch (e:RuntimeException ) {
            e.printStackTrace();
        }
    }


    fun ReceiverBarcodeData(barcodeData: MutableMap<String, Any>)
    {
        try {

            val map = WritableNativeMap()
            for (key in barcodeData.keys) {
                val value: Any = barcodeData[key].toString();
                map.putString(key, value as String);
            }
            constants["barcodeData"] = map
            if (barcodeData.count() == 0) {
                constants["barcodeData"] = "BARCODE_NONE"
            }


            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("ReceiverBarcodeData",  constants["barcodeData"])
        }
        catch (e:RuntimeException ) {
            e.printStackTrace();
        }
    }





}