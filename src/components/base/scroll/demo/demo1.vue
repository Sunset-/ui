<style>
.test-box p {
    width: 700px;
}
</style>

<template>
    <div style="position:relative;height:400px;background:#dedede;border:1px solid #DEDEDE;">
        <np-scroll ref="scroll" style="background:#FFF;max-height:200px;" :options="{paneStyle : 'max-height:200px;'}">
            <div class="test-box" style="padding:20px;">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>12</p>
                <p>13</p>
                <p>14</p>
                <p>12</p>
                <template v-if="flag">
                    <p>13</p>
                    <p>14</p>
                    <p>12</p>
                    <p>13</p>
                    <p>14</p>
                    <p>12</p>
                    <p>13</p>
                    <p>14</p>
                    <p>12</p>
                    <p>13</p>
                    <p>14</p>
                </template>
            </div>
        </np-scroll>
    </div>
</template>
<script>
export default {
    data() {
        return {
            flag: true
            // style: "height:1000px;"
        };
    },
    mounted() {
        setTimeout(() => {
            this.flag = true;
        }, 5000);
    }
};
</script>