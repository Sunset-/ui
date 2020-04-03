<template>
    <div>
        HAHAHa:{{name}}
    </div>
</template>
<script>
export default {
    props : {
        name
    },
	mounted() {
		alert("111");
	}
};
</script>