package com.rfidaguent.Class

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.rfidaguent.RFIDConnect.Class.CRFIDControl
import device.common.DecodeResult
import device.common.DecodeStateCallback
import device.common.ScanConst
import device.sdk.ScanManager

class CScanHandler (private val reactContext: ReactApplicationContext, looper: Looper):android.os.Handler(looper) {
    val TAG = "ScanHandler"
    var mBarType: String? = null
    var mResult:String? =null
    var mRecord: String?=null
    var mScanManager: ScanManager? = null
    var mDecodeResult: DecodeResult? = null
    var mBackupResultType = ScanConst.ResultType.DCD_RESULT_COPYPASTE
    var parent : CRFIDControl? = null
    private val mapBarcodeDataS: MutableMap<String, Any> = HashMap()

    var mStateCallback: DecodeStateCallback? =object : DecodeStateCallback(this) {
        override fun onChangedState(state: Int) {
            when (state) {
                ScanConst.STATE_ON, ScanConst.STATE_TURNING_ON ->  {
                }
                ScanConst.STATE_OFF, ScanConst.STATE_TURNING_OFF ->  {
                }
            }
        }
    }

    val mScanResultReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (mScanManager != null) {
                try {
                    if (ScanConst.INTENT_USERMSG == intent.action) {
                        AddScanBarcodeData()
                    } else if (ScanConst.INTENT_EVENT == intent.action) {
                        val result =
                            intent.getBooleanExtra(ScanConst.EXTRA_EVENT_DECODE_RESULT, false)
                        val decodeBytesLength =
                            intent.getIntExtra(ScanConst.EXTRA_EVENT_DECODE_LENGTH, 0)
                        val decodeBytesValue =
                            intent.getByteArrayExtra(ScanConst.EXTRA_EVENT_DECODE_VALUE)
                        val decodeValue = String(decodeBytesValue!!, 0, decodeBytesLength)
                        val decodeLength = decodeValue.length
                        val symbolName = intent.getStringExtra(ScanConst.EXTRA_EVENT_SYMBOL_NAME)
                        val symbolId = intent.getByteExtra(
                            ScanConst.EXTRA_EVENT_SYMBOL_ID,
                            0.toByte()
                        )
                        val symbolType = intent.getIntExtra(ScanConst.EXTRA_EVENT_SYMBOL_TYPE, 0)
                        val letter = intent.getByteExtra(
                            ScanConst.EXTRA_EVENT_DECODE_LETTER,
                            0.toByte()
                        )
                        val modifier = intent.getByteExtra(
                            ScanConst.EXTRA_EVENT_DECODE_MODIFIER,
                            0.toByte()
                        )
                        val decodingTime = intent.getIntExtra(ScanConst.EXTRA_EVENT_DECODE_TIME, 0)
                        Log.d(TAG, "1. result: $result")
                        Log.d(TAG, "2. bytes length: $decodeBytesLength")
                        Log.d(TAG, "3. bytes value: $decodeBytesValue")
                        Log.d(TAG, "4. decoding length: $decodeLength")
                        Log.d(TAG, "5. decoding value: $decodeValue")
                        Log.d(TAG, "6. symbol name: $symbolName")
                        Log.d(TAG, "7. symbol id: $symbolId")
                        Log.d(TAG, "8. symbol type: $symbolType")
                        Log.d(TAG, "9. decoding letter: $letter")
                        Log.d(TAG, "10.decoding modifier: $modifier")
                        Log.d(TAG, "11.decoding time: $decodingTime")
                        mBarType =symbolName
                        mResult =decodeValue
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    init{
        mScanManager = ScanManager()
        mDecodeResult = DecodeResult()
        mScanManager!!.aDecodeSetBeepEnable(1)
    }

    fun setScannerHandlerCallback():Boolean{
        var bOk: Boolean =  mScanManager!!.aRegisterDecodeStateCallback(mStateCallback)
        mBackupResultType = mScanManager!!.aDecodeGetResultType()
        mScanManager!!.aDecodeSetResultType(ScanConst.ResultType.DCD_RESULT_USERMSG)

        val filter = IntentFilter()
        filter.addAction(ScanConst.INTENT_USERMSG)
        filter.addAction(ScanConst.INTENT_EVENT)
        reactContext.registerReceiver(mScanResultReceiver, filter)

     return bOk;
    }

    fun AddScanBarcodeData(){
        mScanManager!!.aDecodeGetResult(mDecodeResult!!.recycle())
        var barcodeType : String = mDecodeResult!!.symName
        var barcodeResult :String = mDecodeResult!!.toString()
        mapBarcodeDataS["type"] = barcodeType;
        mapBarcodeDataS["result"] = barcodeResult;
        parent!!.ReceiverBarcodeData(mapBarcodeDataS)
        Log.d(TAG,mapBarcodeDataS.toString())
    }


    fun DisScannerHandlerCallBack() {
        mScanManager!!.aDecodeSetResultType(mBackupResultType)
        mScanManager!!.aUnregisterDecodeStateCallback(mStateCallback)

    }

    fun DisScannerBroadCast(){
        reactContext.unregisterReceiver(mScanResultReceiver)
    }

}