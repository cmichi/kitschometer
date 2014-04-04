#!/bin/bash

# ////////// DEFINES \\\\\\\\\\\\\

P_LATCH=4
P_CLK=17
P_DATA=18

# ///////// FUNCTIONS \\\\\\\\\\\\

function initKeyboard {
        echo $P_LATCH > /sys/class/gpio/export
        echo "out" > /sys/class/gpio/gpio$P_LATCH/direction

        echo $P_CLK > /sys/class/gpio/export
        echo "out" > /sys/class/gpio/gpio$P_CLK/direction

        echo $P_DATA > /sys/class/gpio/export
        echo "in" > /sys/class/gpio/gpio$P_DATA/direction
}

function uninitKeyboard {
        echo $P_LATCH > /sys/class/gpio/unexport
        echo $P_CLK   > /sys/class/gpio/unexport
        echo $P_DATA  > /sys/class/gpio/unexport
}


function setLATCH {
        echo "1" > /sys/class/gpio/gpio$P_LATCH/value
}
function unsetLATCH {
        echo "0" > /sys/class/gpio/gpio$P_LATCH/value
}

function clock {
        echo "1" > /sys/class/gpio/gpio$P_CLK/value
        echo "0" > /sys/class/gpio/gpio$P_CLK/value
}

function readValue {
        value=0
        for i in {1..8}; do
                let "value <<= 1"
                let "value += $(cat /sys/class/gpio/gpio$P_DATA/value)"
                clock
        done
}

# //////// read parameter \\\\\\\\

while getopts "iu" opt; do
        case $opt in
                i) init=1;;
                u) uninit=1;;
        esac
done

# /////////// MAIN \\\\\\\\\\\\\\\

if [[ -z $init ]]; then
        initKeyboard
fi

setLATCH

readValue

echo $value

unsetLATCH

if [[ -z $uninit ]]; then
        uninitKeyboard
fi

