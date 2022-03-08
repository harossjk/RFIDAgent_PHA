package com.rfidaguent.RFIDConnect.Class

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import android.widget.Toast
import androidx.core.app.ActivityCompat
import com.rfidaguent.MainApplication
import device.sdk.RFIDManager
import java.util.ArrayList

class CBluetooth (crfidManager: RFIDManager){
    val REQUEST_COARSE_LOCATION_PERMISSIONS = 201
    val DOTR3000_UHF_READER = "DOTR3"
    val RF800_UHF_READER = "RF"
    var _finish = false

    val KEY_NAME = "name"
    val KEY_SUMMARY = "summary"
    val KEY_ADDRESS = "address"

    var bluetoothAdapter: BluetoothAdapter? = null
    var m_rfidManager: RFIDManager? = null
    init {
        m_rfidManager = crfidManager;
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    }


    fun StartDiscovery() {
        if (!bluetoothAdapter!!.isEnabled) {
            Toast.makeText(MainApplication.instance, "Please turn on Bluetooth power.", Toast.LENGTH_SHORT).show()
            return
        }
        else
        {
            bluetoothAdapter!!.startDiscovery()
        }
    }


    fun StopDiscovery(){
        bluetoothAdapter!!.cancelDiscovery()
    }


}