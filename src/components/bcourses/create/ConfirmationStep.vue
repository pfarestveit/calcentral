<template>
  <div>
    <div class="bc-alert bc-alert-info" role="alert">
      <!-- TODO: data-cc-focus-reset-directive -->
      <h2 class="cc-visuallyhidden" data-cc-focus-reset-directive="confirmFocus">Confirm Course Site Details</h2>
      <strong>
        You are about to create a {{ currentSemesterName }} course site with {{ pluralize('section', selectedSectionsList.length) }}:
      </strong>
      <ul class="bc-page-create-course-site-section-list">
        <li v-for="section in selectedSectionsList" :key="section.ccn">
          {{ section.courseTitle }} - {{ section.courseCode }} {{ section.section_label }} ({{ section.ccn }})
        </li>
      </ul>
    </div>
    <div>
      <form
        name="createCourseSiteForm"
        class="bc-canvas-page-form"
        @submit="create"
      >
        <b-container>
          <b-row>
            <b-col class="pr-1" sm="3">
              <label for="siteName" class="right">
                Site Name:
              </label>
            </b-col>
            <b-col class="pl-0" sm="9">
              <b-form-input
                id="siteName"
                v-model="siteName"
                class="w-50"
                name="siteName"
                :required="true"
              />
              <div v-if="!$_.trim(siteName)" class="bc-alert bc-notice-error">
                <fa icon="exclamation-circle" class="cc-left cc-icon-red bc-canvas-notice-icon"></fa>
                Please fill out a site name.
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="pr-1" sm="3">
              <label for="siteAbbreviation" class="right">Site Abbreviation:</label>
            </b-col>
            <b-col class="pl-0" sm="9">
              <b-form-input
                id="siteAbbreviation"
                v-model="siteAbbreviation"
                class="w-50"
                :required="true"
              />
              <div v-if="!$_.trim(siteAbbreviation)" class="bc-alert bc-notice-error">
                <fa icon="exclamation-circle" class="cc-left cc-icon-red bc-canvas-notice-icon"></fa>
                Please fill out a site abbreviation.
              </div>
            </b-col>
          </b-row>
        </b-container>
        <div class="d-flex flex-row-reverse">
          <div>
            <b-button
              aria-controls="bc-page-create-course-site-steps-container"
              aria-label="Create Course Site"
              class="bc-canvas-button bc-canvas-button-primary"
              :disabled="!$_.trim(siteName) || !$_.trim(siteAbbreviation)"
              @click="create"
            >
              Create Course Site
            </b-button>
          </div>
          <div class="pr-2">
            <b-button
              class="bc-canvas-button"
              @click="goBack"
            >
              Go Back
            </b-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Iframe from '@/mixins/Iframe'
import Utils from '@/mixins/Utils'

export default {
  name: 'ConfirmationStep',
  mixins: [Iframe, Utils],
  props: {
    createCourseSiteJob: {
      required: true,
      type: Function
    },
    currentSemesterName: {
      required: true,
      type: String
    },
    selectedSectionsList: {
      required: true,
      type: Array
    },
    goBack: {
      required: true,
      type: Function
    }
  },
  data: () => ({
    siteAbbreviation: undefined,
    siteName: undefined
  }),
  created() {
    // TODO: put focus
    // $scope.confirmFocus = true;
    const section = this.selectedSectionsList[0]
    this.siteName = `${section.courseTitle} (${this.currentSemesterName})`
    this.siteAbbreviation = `${section.courseCode}-${section.instruction_format}-${section.section_number}`
    this.currentWorkflowStep = 'confirmation'
    this.iframeScrollToTop()
  },
  methods: {
    create() {
      this.createCourseSiteJob(this.siteName, this.siteAbbreviation)
    }
  }
}
</script>

<style scoped lang="scss">
.bc-page-create-course-site-section-list {
  list-style-type: disc;
  margin: 10px 0 0 39px;
}
</style>