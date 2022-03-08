import axios from "axios";
import React, { useRef, useState, useMemo, useCallback } from 'react';
import { baseURL } from "../components/Sever/Sever";
export const urls = {
    rackList: `${baseURL}/rack/`
};


export const useCallbackHandler = useCallback(async (readState: any, b: any) => {
    try {
        console.log("readState", readState);



    } catch (err) {
        console.log(err);
    }

}, []);


