#!/bin/bash
phing 0deps &
phing nc &
phing light &
phing debug &
phing &