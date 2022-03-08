package com.rfidaguent.Class

class CRFIDTag (sDataType: String?, sDataValue: String?, nCount: Int) {

    private var mDataType: String? = null
    private var mDataValue: String? = null
    private var mDataCount = 0

    init {
        mDataType = sDataType
        mDataValue = sDataValue
        mDataCount = nCount
    }

    fun getDataType(): String? {
        return mDataType
    }

    fun getDataValue(): String? {
        return mDataValue
    }

    fun getDataCount(): Int {
        return mDataCount
    }

    fun setDataCount(nCount: Int) {
        mDataCount = nCount
    }
}