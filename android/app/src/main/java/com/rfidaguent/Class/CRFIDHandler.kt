package com.rfidaguent.RFIDConnect.Class

import android.os.CountDownTimer
import android.os.Looper
import android.os.Message
import android.util.Log
import com.rfidaguent.Class.CRFIDTag
import com.rfidaguent.util.PreferenceUtil
import device.common.rfid.*
import device.sdk.RFIDManager


class CRFIDHandler(rfidManager: RFIDManager, looper: Looper) : android.os.Handler(looper) {

    private val TAG = "RFIDHandler"
    private val MSG_COMMAND_SET_RFID_DEFAULT = 1
    private val MSG_COMMAND_SET_RFID_INVENTORY_PARAM = 2
    private val MSG_COMMAND_SET_RFID_TX_POWER = 3
    private val MSG_COMMAND_SET_RFID_TX_CYCLE = 4
    private val MSG_COMMAND_SET_RFID_PREFIX = 5
    private val MSG_COMMAND_SET_RFID_SUFFIX = 6
    private val MSG_COMMAND_SET_RFID_TX_DATA_FORMAT = 7
    private val MSG_COMMAND_SET_RFID_RESULT_TYPE = 8
    private val MSG_COMMAND_SET_RFID_INVENTORY_MODE = 9

    var modeOfInvent: ModeOfInvent? = null
    private var paramOfInvent: ParamOfInvent? = null
    private var txCycle: TxCycle? = null

    private val mapDevicConfigS: MutableMap<String, Any> = HashMap()
    var parent: CRFIDControl? = null
    var m_rfidManager: RFIDManager? = null;

    private var isRfidRunning :Boolean = false;

    var mRFIDCallback: RFIDCallback? = object : RFIDCallback(this) {
        override fun onNotifyReceivedPacket(recvPacket: RecvPacket) {
                Log.i("RFID_callbacks", "onNotifyReceivedPacket")
                if (isRfidRunning)
                    addScanData(recvPacket.RecvString)
        }

        override fun onNotifyDataWriteFail() {
            Log.i("RFID_callbacks", "onNotifyDataWriteFail")
        }

        override fun onNotifyChangedState(state: Int) {

            Log.i("RFID_callbacks", "onNotifyChangedState")
            when (state) {
                1 -> { Log.i("RFID_callbacks", "onNotifyChangedState BT_CONNECTED : [$state]") }
                2 -> { Log.i("RFID_callbacks", "onNotifyChangedState BT_CONNECT_FAILED : [$state]") }
                3 -> { Log.i("RFID_callbacks", "onNotifyChangedState BT_OPENED : [$state]") }
                4 -> { Log.i("RFID_callbacks", "onNotifyChangedState BT_CLOSED : [$state]") }
                5 -> Log.i("RFID_callbacks", "onNotifyChangedState USB_OPENED : [$state]")
                6 -> Log.i("RFID_callbacks", "onNotifyChangedState USB_CLOSED : [$state]")
                7 -> Log.i("RFID_callbacks", "onNotifyChangedState UART_OPENED : [$state]")
                8 -> Log.i("RFID_callbacks", "onNotifyChangedState UART_CLOSED : [$state]")
                9 -> Log.i(
                    "RFID_callbacks",
                    "onNotifyChangedState TRIGGER_MODE_RFID : [$state]"
                )
                10 -> Log.i(
                    "RFID_callbacks",
                    "onNotifyChangedState TRIGGER_MODE_SCAN : [$state]"
                )
                11 -> {
                    Log.i(
                        "RFID_callbacks",
                        "onNotifyChangedState TRIGGER_RFID_KEYDOWN : [$state]"
                    )
                     isRfidRunning= startRfidScan();
                }
                12 -> {
                    Log.i(
                        "RFID_callbacks",
                        "onNotifyChangedState TRIGGER_RFID_KEYUP : [$state]"
                    )
                    isRfidRunning =stopRfidScan();
                }
                13 -> {
                    Log.i(
                        "RFID_callbacks",
                        "onNotifyChangedState TRIGGER_SCAN_KEYDOWN : [$state]"
                    )

                    parent!!.ToastMessage("RFID 모드가 아닙니다.\n리더기의 왼쪽 방향의 (M)을눌러\n (S) LED가 비활성화 되었는지 확인하여주십시오.");
                }
                14 -> Log.i(
                    "RFID_callbacks",
                    "onNotifyChangedState TRIGGER_SCAN_KEYUP : [$state]"

                )
                15 -> Log.i("RFID_callbacks", "onNotifyChangedState LOW_BATT : [$state]")
                16 -> Log.i("RFID_callbacks", "onNotifyChangedState POWER_OFF : [$state]")
                else -> {
                }
            }
        }
    }

    init {
        this.m_rfidManager = rfidManager;
        this.modeOfInvent = ModeOfInvent();
        this.paramOfInvent = ParamOfInvent();
        this.txCycle = TxCycle();
    }

    fun setRFIDHandlerCallback():Boolean {
        var bOk: Boolean = m_rfidManager!!.RegisterRFIDCallback(mRFIDCallback);
        if (bOk)
        {
            Log.d("setRFIDHandlerCallback", "콜백 있음")
        }
        else
            Log.d("setRFIDHandlerCallback", "콜백 없음")
        return bOk
    }

    fun DisRFIDHandlerCallBack(): Boolean {
        var bOk: Boolean = m_rfidManager!!.UnregisterRFIDCallback(mRFIDCallback);
        if (bOk)
            Log.d("setRFIDHandlerCallback", "콜백 지워짐")
        else
            Log.d("setRFIDHandlerCallback", "콜백 안지워짐")
        return bOk
    }

    override fun handleMessage(msg: Message) {
        val iErr: Int
        Log.i(TAG, "handleMessage$msg")
        when (msg.what) {
            MSG_COMMAND_SET_RFID_DEFAULT -> {
                iErr = m_rfidManager!!.SetDefaultConfig()

                if (iErr != RFIDConst.CommandErr.SUCCESS) {
                    Log.e(TAG, "SetDefaultConfig() is failed : $iErr")
                }
            }
            MSG_COMMAND_SET_RFID_INVENTORY_PARAM -> {
                paramOfInvent!!.session = 1
                paramOfInvent!!.q = 5
                paramOfInvent!!.inventoryFlag = 2
                iErr = m_rfidManager!!.SetInventoryParam(paramOfInvent)
                if (iErr != RFIDConst.CommandErr.SUCCESS) {
                    Log.e(TAG, "SetInventoryParam() is failed : $iErr")
                }
            }
            MSG_COMMAND_SET_RFID_TX_POWER -> {
                iErr = m_rfidManager!!.SetTxPower(0)
                if (iErr != RFIDConst.CommandErr.SUCCESS) {
                    Log.e(TAG, "SetTxPower() is failed : $iErr")
                }
                Log.d(
                    TAG,
                    "GetTxPower() : " + m_rfidManager!!.GetTxPower()
                )
                Log.d(
                    TAG,
                    "GetOemInfo() : " + m_rfidManager!!.GetOemInfo()
                )
            }
            MSG_COMMAND_SET_RFID_TX_CYCLE -> {
                txCycle!!.onTime = 100
                txCycle!!.offTime = 10
                iErr = m_rfidManager!!.SetTxCycle(txCycle)
                if (iErr != RFIDConst.CommandErr.SUCCESS) {
                    Log.e(TAG, "SetTxCycle() is failed : $iErr")
                }
            }
            MSG_COMMAND_SET_RFID_PREFIX -> {
                //var  prefix: String?= "Prefix_"
            }
            MSG_COMMAND_SET_RFID_SUFFIX -> {
                //var  suffix: String?= "_Suffix"
            }
            MSG_COMMAND_SET_RFID_TX_DATA_FORMAT -> {
                /*
                 * public static final int TX_FORMAT_TAG_DATA = 0;
                 * public static final int TX_FORMAT_PREFIX_TAG_DATA = 1;
                 * public static final int TX_FORMAT_TAG_DATA_SUFFIX = 2;
                 * public static final int TX_FORMAT_PREFIX_TAG_DATA_SUFFIX = 3;
                 */iErr =
                    m_rfidManager!!.SetTxDataFormat(RFIDConst.RFIDConfig.TX_FORMAT_TAG_DATA)
                if (iErr != RFIDConst.CommandErr.SUCCESS) {
                    Log.e(TAG, "SetTxDataFormat() is failed : $iErr")
                }
                Log.d(
                    TAG,
                    "Data format : " + m_rfidManager!!.GetDataFormat()
                )
            }
            MSG_COMMAND_SET_RFID_RESULT_TYPE ->                     /*
                     * public static final int RFID_RESULT_CALLBACK = 0;
                     * public static final int RFID_RESULT_KBDMSG = 1;
                     * public static final int RFID_RESULT_COPYPASTE = 2;
                     * public static final int RFID_RESULT_USERMSG = 3;
                     * public static final int RFID_RESULT_EVENT = 4;
                     * public static final int RFID_RESULT_CUSTOM_INTENT = 5;
                     */
                m_rfidManager!!.SetResultType(RFIDConst.ResultType.RFID_RESULT_CALLBACK)
            MSG_COMMAND_SET_RFID_INVENTORY_MODE -> {
                modeOfInvent!!.single = 1 // 0 Continue Mode
                modeOfInvent!!.select = 0
                modeOfInvent!!.timeout = 0
                m_rfidManager!!.SetOperationMode(modeOfInvent)
                Log.d(
                    TAG,
                    "Device name : " + m_rfidManager!!.GetBtDevice()
                )
            }
        }
    }

    fun getDeviceConfig(): MutableMap<String, Any> {
        if (this.m_rfidManager != null && this.m_rfidManager?.IsOpened() == true) {

            //A & B Mode로 바꾸어서 연속으로 Tag를 읽게 바꿈
            paramOfInvent!!.session = 1
            paramOfInvent!!.q = 5
            paramOfInvent!!.inventoryFlag = 2
            m_rfidManager!!.SetInventoryParam(paramOfInvent)

            mapDevicConfigS["devName"] = this.m_rfidManager!!.GetBtDevice().uppercase() //디바이스 이름
            Log.d("devName", mapDevicConfigS["devName"].toString())

            mapDevicConfigS["devMacAdrr"] =
                this.m_rfidManager!!.GetBtMacAddr()!!.uppercase(); //디바이스 주소
            Log.d("devMacAdrr", mapDevicConfigS["devMacAdrr"].toString())

            mapDevicConfigS["devBuzzer"] = this.m_rfidManager!!.GetBuzzerVol() // 볼륨
            Log.d("devBuzzer", mapDevicConfigS["devBuzzer"].toString())

            mapDevicConfigS["devVibState"] = this.m_rfidManager!!.GetVibState() // 진동
            Log.d("devVibState", mapDevicConfigS["devVibState"].toString())

            this.m_rfidManager!!.GetOperationMode(modeOfInvent)
            mapDevicConfigS["devContinue"] = modeOfInvent!!.single // Continue read Mode
            Log.d("devContinue", mapDevicConfigS["devContinue"].toString())

            mapDevicConfigS["devRadio"] = this.m_rfidManager!!.GetTxPower() //Radio Power
            Log.d("devRadio", mapDevicConfigS["devRadio"].toString())
        }
        return this.mapDevicConfigS;
    }

    fun setDeviceConfigSetting() {
        this.sendMessageDelayed(this.obtainMessage(MSG_COMMAND_SET_RFID_DEFAULT, 0, 0, null), 200)
        this.sendMessageDelayed(
            this.obtainMessage(
                MSG_COMMAND_SET_RFID_INVENTORY_PARAM,
                0,
                0,
                null
            ), 400
        )
        this.sendMessageDelayed(this.obtainMessage(MSG_COMMAND_SET_RFID_TX_POWER, 0, 0, null), 600)
        this.sendMessageDelayed(this.obtainMessage(MSG_COMMAND_SET_RFID_TX_CYCLE, 0, 0, null), 800)
        this.sendMessageDelayed(this.obtainMessage(MSG_COMMAND_SET_RFID_PREFIX, 0, 0, null), 1000)
        this.sendMessageDelayed(this.obtainMessage(MSG_COMMAND_SET_RFID_SUFFIX, 0, 0, null), 1200)
        this.sendMessageDelayed(
            this.obtainMessage(MSG_COMMAND_SET_RFID_TX_DATA_FORMAT, 0, 0, null),
            1400
        )
        this.sendMessageDelayed(
            this.obtainMessage(MSG_COMMAND_SET_RFID_RESULT_TYPE, 0, 0, null),
            1600
        )
        this.sendMessageDelayed(
            this.obtainMessage(MSG_COMMAND_SET_RFID_INVENTORY_MODE, 0, 0, null),
            1800
        )
    }

    fun spltScanData(data: String): String {
        var tempData = data
        var ran = IntRange(4, 35) // 4번째 : 5038106628 / 24번째 : 008867
        tempData = tempData.slice(ran)
        var splitdata = tempData.chunked(4);

        var combineData = "";
        if (splitdata != null) {
            for (index in 0..splitdata.count() - 1) {
                for (i in 0..splitdata[index].length) {
                    if (i % 2 == 1) {
                        combineData += splitdata[index][i];
                    } else
                        continue;
                }
            }
        }
        return combineData
    }

    fun addScanData(data: String?) {
        try {
            val count = 1
            val item: CRFIDTag
            if (data != null) {
                var combineData: String = spltScanData(data)

                item = CRFIDTag(
                    if (isRfidRunning) "RFID" else "CONFIG",
                    combineData,
                    count
                )

                if(data.length==80)
                {
                    parent!!.ReceiverScanData(item.getDataValue().toString())
                    Log.d("count", item.getDataValue().toString())
                }

            }
        }
        catch (e: Exception){
            e.printStackTrace();
        }
    }
    fun startRfidScan():Boolean {
        if (!isRfidRunning) {
            isRfidRunning = true
            parent!!.ReceiverScanStatuse(isRfidRunning)
        }
        return isRfidRunning;
    }

    fun stopRfidScan() :Boolean{
        if (isRfidRunning) {
            isRfidRunning = false
            parent!!.ReceiverScanStatuse(isRfidRunning)
            m_rfidManager!!.Stop()
        }
        return isRfidRunning;
    }

}
