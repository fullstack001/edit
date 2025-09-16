<template>
  <div class="process" >

    <!-- <img src="@/assets/img/Fidget-spinner.gif" class="spinner" width="150px" />
    <img src="@/assets/img/Skype loader.gif" class="spinner" width="150px" />
    <img src="@/assets/img/Spinner-3.gif" class="spinner" width="150px" /> -->
    <img src="@/assets/img/805.gif" class="spinner" width="60px" alt="Spinner" />
    <div class="progress-des">
      File Processing...
    </div>
  </div>
</template>
<script>
export default {
  props: ["progress", "text"],
};
</script>
<style scoped>
.process {
  background: #fefefe;
  width: 100%;
  height: 100vh;
  margin: auto;
  text-align: center;
}
.progress-logo {
  margin-top: 30px;
}
.process_title {
  font-size: 32px;
  font-weight: 600;
  margin: 20px;
  margin-top: 80px;
}
.spinner {
  margin-bottom: 30px;
  margin-top: 100px;
}
.progress-des {
  font-size: 25px;
  font-weight: 500;
}
@media (max-width: 640px) {
  .progress-des {
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
