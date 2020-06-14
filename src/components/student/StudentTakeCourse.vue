<template>
  <div>
    <a-page-header
            title="学生选课"
    />

    <h3>课程列表</h3>
    <all-courses/>
    <a-card title="已选课程" hoverable>
      <enrolled-courses/>
    </a-card>
  </div>
</template>

<script>
    import AllCourses from "./AllCourses";
    import EnrolledCourses from "./EnrolledCourses";

    export default {
        name: "StudentTakeCourse",
        components: {EnrolledCourses, AllCourses},
    }
</script>

<style scoped>

</style>