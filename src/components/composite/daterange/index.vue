<template>
    <div class="xui-daterange xui-daterange-style">
        <shortcut-datepicker-radio v-if="shortcuts" v-model="currentShortcut" :options="{manner:'button',data:shortcuts}"></shortcut-datepicker-radio>
        <div class="datePicker-wrap" v-show="!currentShortcut">
            <date-picker class="dib " :disabled="disabledStart" :options="startOptions" v-model="startTime" @change="startTimeHandle"></date-picker>
            <i class="dd-split"> - </i>
            <date-picker class="dib" :disabled="disabledEnd" :options="endOptions" v-model="endTime" @change="endTimeHandle"></date-picker>
            <date-button class="dd-schbtn" :options="searchBtnOptions" v-if="searchBtnOptions" @click="searchCallBack"></date-button>
        </div>
    </div>
</template>

<script>
import shortcutDatepickerRadio from "../../base/radio"
import Sunset from "../../../common/sunset"
import datePicker from "../../base/datepicker"
import dateButton from "../../base/button"

export default {
    components: {
        datePicker: datePicker,
        dateButton: dateButton,
        shortcutDatepickerRadio: shortcutDatepickerRadio
    },
    model: {
        prop: "value",
        event: "input"
    },
    props: {
        options: {
            type: Object
        },
        disabled: {},
        value: {}
    },
    data: function() {
        return {
            currentShortcut: null,
            startTime: this.value && this.value[0],
            endTime: this.value && this.value[1],
            shortcutsMap: {},
            lock: false,
            locks: false
        }
    },
    computed: {
        safeOptions() {
            return this.options || {}
        },
        cdisabled() {
            return this.disabled || this.safeOptions.disabled
        },
        disabledStart() {
            return this.cdisabled || this.safeOptions.disabledStart
        },
        disabledEnd() {
            return this.cdisabled || this.safeOptions.disabledEnd
        },
        shortcuts() {
            var shortcuts = this.safeOptions.shortcuts
            if (shortcuts && shortcuts.length === 0) {
                return shortcuts
            }
            if (shortcuts) {
                shortcuts = shortcuts.map(item => {
                    this.shortcutsMap[item.label] = item
                    return {
                        text: item.label,
                        value: item.label
                    }
                })
                shortcuts.push({
                    text: "自定义",
                    value: ""
                })
            }
            return shortcuts
        },
        format() {
            return this.safeOptions.format || "yyyy-MM-dd HH:mm:ss"
        },
        valueFormat() {
            return this.safeOptions.valueFormat
        },
        yearRange() {
            return this.safeOptions.yearRange
        },
        startOptions() {
            var self = this.safeOptions
            return {
                start1: this.startTime,
                type: this.safeOptions.type,
                format: this.format,
                placeholder: this.safeOptions.startPlaceholder,
                valueFormat: this.valueFormat,
				yearRange: this.yearRange,
				disabledDate: function(time) {
					if(this.safeOptions.maxTime && this.safeOptions.maxTime> 0 ){
						return time.getTime() < this.safeOptions.maxTime
					} else {
						return false;
					}
                    
                }.bind(this)
            }
        },
        endOptions() {
            var self = this.safeOptions
            return {
                type: this.safeOptions.type,
                format: this.format,
                placeholder: this.safeOptions.endPlaceholder,
                valueFormat: this.valueFormat,
                yearRange: this.yearRange,
                disabledDate: function(time) {
					if(this.safeOptions.maxTime && this.safeOptions.maxTime> 0 ){
						return time.getTime() > new Date() || time.getTime() < this.safeOptions.maxTime;
					}else{
						return false;
					}
                }.bind(this)
            }
        },
        searchBtnOptions() {
            return this.safeOptions.searchButton || null
        }
    },
    methods: {
        startTimeHandle(st) {
            if (this.options.timeInterval && this.options.timeInterval > 0) {
                let timeInterval =
                    this.options.timeInterval * 24 * 60 * 60 * 1000
                if (this.endTime - st > timeInterval) {
                    this.$message({
                        message: `时间范围超出系统最大跨度，当前支持最大跨度为${this.options.timeInterval}天`,
                        type: "warning"
                    })
                }
            }
        },
        endTimeHandle(et) {
            if (this.options.timeInterval && this.options.timeInterval > 0) {
                let timeInterval =
                    this.options.timeInterval * 24 * 60 * 60 * 1000
                if (et - this.startTime > timeInterval) {
                    this.$message({
                        message: `时间范围超出系统最大跨度，当前支持最大跨度为${this.options.timeInterval}天`,
                        type: "warning"
                    })
                }
            }
        },
        defaultValue(index) {
            this.lock = true
            this.currentShortcut = this.shortcuts
                ? this.shortcuts[index].value
                : null
            this.$nextTick(() => {
                this.lock = false
            })
            return this.calculateValue()
        },
        formatDateValue(v) {
            var value = new Date(v)
            if (this.valueFormat === "timestamp") {
                return value.getTime()
            } else if (Sunset.isString(this.valueFormat)) {
                return Sunset.Dates.format(value, this.valueFormat)
            } else {
                return value
            }
        },
        calculateValue() {
            var value = void 0
            var currentShortcut = this.currentShortcut
            if (this.shortcutsMap[currentShortcut]) {
                var outValue = this.shortcutsMap[currentShortcut].value()
                value = [
                    this.formatDateValue(outValue[0]),
                    this.formatDateValue(outValue[1])
                ]
                this.startTime = this.formatDateValue(outValue[0])
                this.endTime = this.formatDateValue(outValue[1])
                this.locks = true
                this.$nextTick(() => {
                    this.locks = false
                })
            } else {
                this.currentShortcut = ""
                value = [this.startTime, this.endTime]
            }
            if (!value[0] && !value[1]) {
                value = void 0
            } else {
                value.__xui_daterange_type = this.currentShortcut
            }
            this.$emit("input", value)
            if (
                this.value &&
                value &&
                (this.value[0] != value[0] || this.value[1] != value[1])
            ) {
                this.$emit("change", value)
            }
            return value
        },
        searchCallBack() {
            this.$emit("search")
            if (this.safeOptions.searchButton.operate) {
                this.safeOptions.searchButton.operate([
                    this.startTime,
                    this.endTime
                ])
            }
            if (this.safeOptions.searchCallBack) {
                this.safeOptions.searchCallBack([this.startTime, this.endTime])
            }
        }
    },
    watch: {
        startTime(val) {
            if (this.locks) {
                return
            }
            this.lock = true
            this.calculateValue()
            this.$nextTick(() => {
                this.lock = false
            })
        },
        endTime() {
            if (!this.lock) {
                this.lock = true
                this.calculateValue()
                this.$nextTick(() => {
                    this.lock = false
                })
            }
        },
        currentShortcut() {
            if (!this.lock) {
                this.lock = true
                this.calculateValue()
                this.$nextTick(() => {
                    this.lock = false
                })
            }
        },
        value(value) {
            if (!this.lock) {
                if (value && value.__xui_daterange_type) {
                    this.currentShortcut = value.__xui_daterange_type
                } else {
                    this.currentShortcut = null
                }
                this.startTime = value && value[0]
                this.endTime = value && value[1]
            }
        }
    }
}
</script>
<style lang="less">
.xui-daterange {
    /*默认样式 不建议修改*/
    min-height: 30px;
    line-height: 45px;
    .xui-radio-group {
        display: inline-block;
        vertical-align: middle;
    }
    .datePicker-wrap {
        display: inline-block;
        vertical-align: middle;

        .dib {
            width: 177px;
            vertical-align: middle;
        }
    }
    .dd-split {
        color: #999;
        display: inline-block;
        vertical-align: middle;
    }
    .dd-schbtn {
        margin-left: 8px;
        display: inline-block;
        vertical-align: middle;
    }
}
</style>
