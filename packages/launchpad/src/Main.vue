<template>
  <template v-if="query.data.value">
    <HeaderBar
      class="w-full z-10 fixed"
    />
    <MajorVersionWelcome
      v-if="shouldShowWelcome"
      class="pt-[64px]"
      :video-html="videoHtml"
      @clearLandingPage="handleClearLandingPage"
    >
      <template
        v-if="videoHtml"
        #video
      >
        <div
          class="major-version-welcome-video"
          v-html="videoHtml"
        />
      </template>
    </MajorVersionWelcome>
    <div
      v-else
      class="px-[24px] pt-[86px] pb-[24px]"
    >
      <BaseError
        v-if="query.data.value.baseError"
        :gql="query.data.value.baseError"
        @retry="resetErrorAndLoadConfig"
      />
      <GlobalPage
        v-else-if="query.data.value.isGlobalMode && !query.data.value?.currentProject"
        :gql="query.data.value"
      />
      <MigrationWizard
        v-else-if="currentProject?.needsLegacyConfigMigration"
      />
      <template v-else>
        <ScaffoldedFiles
          v-if="query.data.value.scaffoldedFiles"
          :gql="query.data.value"
        />
        <Spinner v-else-if="currentProject?.isLoadingConfigFile" />
        <template v-else-if="!currentProject?.currentTestingType">
          <WarningList :gql="query.data.value" />
          <LaunchpadHeader
            :title="t('welcomePage.title')"
            description=""
          />
          <StandardModal
            v-model="isTestingTypeModalOpen"
            class="h-full w-full sm:h-auto sm:mx-[5%] sm:w-auto"
            help-link="https://on.cypress.io/choosing-testing-type"
          >
            <template #title>
              {{ t('welcomePage.compareTypes.modalTitle') }}
            </template>
            <CompareTestingTypes />
          </StandardModal>
          <button
            class="mx-auto mt-[12px] text-indigo-500 text-[18px] block hocus-link-default group"
            @click="isTestingTypeModalOpen = true"
          >
            {{ t('welcomePage.review') }}<i-cy-arrow-right_x16
              class="ml-[4px] transform transition-transform ease-in translate-y-[-1px] duration-200 inline-block icon-dark-current group-hocus:translate-x-[2px]"
            />
          </button>
          <Disclosure
            v-slot="{ open }"
            as="div"
            class="border-dashed border w-1/3 border-gray-200 px-4 py-6 mx-auto my-auto overflow-y-scroll mt-5 max-h-96"
          >
            <h3 class="-mx-2 -my-3 flow-root">
              <DisclosureButton class="flex w-full items-center justify-center bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                <span class="font-medium text-gray-900">{{ 'Select the initialization languages' }}</span>
                <span class="ml-6 flex items-center">
                  <i-cy-chevron-right_x16
                    class="h-[16px] w-[16px] icon-dark-indigo-400"
                    :class="open ? 'transform rotate-90': ''"
                  />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel class="pt-6 w-32 mx-auto">
              <div class="space-y-6">
                <div
                  v-for="(option, optionIdx) in localeFilters"
                  :key="option.value"
                  class="flex items-center"
                >
                  <input
                    :id="`${optionIdx}`"
                    :checked="option.checked"
                    :value="option.value"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    @change="handleChange"
                  >
                  <label
                    :for="`${optionIdx}`"
                    class="ml-3 min-w-0 text-gray-500"
                  >{{ option.label }}</label>
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
          <TestingTypeCards
            :gql="query.data.value"
          />
        </template>
        <Wizard
          v-else-if="currentProject.currentTestingType === 'component' && !currentProject.isCTConfigured"
          :gql="query.data.value"
        />
        <template v-else-if="!currentProject?.isFullConfigReady">
          <LaunchpadHeader
            :title="t('components.loading.config.title')"
            :description="t('components.loading.config.description')"
          />
          <Spinner />
        </template>
        <OpenBrowser v-else />
      </template>
    </div>
    <CloudViewerAndProject />
    <LoginConnectModals />
  </template>
  <Spinner v-else />
  <div data-e2e />
</template>

<script lang="ts" setup>
import { gql, useMutation, useQuery } from '@urql/vue'
import { MainLaunchpadQueryDocument, Main_ResetErrorsAndLoadConfigDocument, Main_LaunchProjectDocument, Main_ResetInitLocalesDocument } from './generated/graphql'
import { useToast } from 'vue-toastification'
import TestingTypeCards from './setup/TestingTypeCards.vue'
import Wizard from './setup/Wizard.vue'
import GlobalPage from './global/GlobalPage.vue'
import BaseError from '@cy/gql-components/error/BaseError.vue'
import WarningList from './warning/WarningList.vue'
import StandardModal from '@cy/components/StandardModal.vue'
import HeaderBar from '@cy/gql-components/HeaderBar.vue'
import Spinner from '@cy/components/Spinner.vue'
import CompareTestingTypes from './setup/CompareTestingTypes.vue'
import MigrationWizard from './migration/MigrationWizard.vue'
import ScaffoldedFiles from './setup/ScaffoldedFiles.vue'
import MajorVersionWelcome from './migration/MajorVersionWelcome.vue'
import { useI18n } from '@cy/i18n'
import { computed, ref } from 'vue'
import LaunchpadHeader from './setup/LaunchpadHeader.vue'
import OpenBrowser from './setup/OpenBrowser.vue'
import LoginConnectModals from '@cy/gql-components/LoginConnectModals.vue'
import CloudViewerAndProject from '@cy/gql-components/CloudViewerAndProject.vue'
import { usePromptManager } from '@cy/gql-components/composables/usePromptManager'
import { MAJOR_VERSION_FOR_CONTENT } from '@packages/types'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import { LOCALE_DATA, Locale } from '@packages/data-context/src/actions/LocaleOptions'
const { setMajorVersionWelcomeDismissed } = usePromptManager()
const { t } = useI18n()
const isTestingTypeModalOpen = ref(false)

const toast = useToast()

gql`
fragment MainLaunchpadQueryData on Query {
  ...TestingTypeCards
  ...Wizard
  baseError {
    id
    ...BaseError
  }
  localSettings {
    preferences {
      majorVersionWelcomeDismissed
      wasBrowserSetInCLI
    }
  }
  currentProject {
    id
    initLocales
    isCTConfigured
    isE2EConfigured
    isLoadingConfigFile
    isLoadingNodeEvents
    isFullConfigReady
    needsLegacyConfigMigration
    currentTestingType
    activeBrowser {
      id
    }
  }
  videoEmbedHtml
  isGlobalMode
  ...GlobalPage
  ...ScaffoldedFiles
  ...WarningList
}
`

gql`
query MainLaunchpadQuery {
  ...MainLaunchpadQueryData
}
`

gql`
mutation Main_ResetErrorsAndLoadConfig($id: ID!) {
  resetErrorAndLoadConfig(id: $id) {
    ...MainLaunchpadQueryData
  }
}
`

gql`
mutation Main_LaunchProject ($testingType: TestingTypeEnum!)  {
  launchOpenProject {
    id
  }
  setProjectPreferencesInGlobalCache(testingType: $testingType) {
    currentProject {
      id
      title
    }
  }
}
`

gql`
mutation Main_ResetInitLocales($initLocales: String!) {
  setProjectInitLocales(initLocales: $initLocales) {
    ...MainLaunchpadQueryData
  }
}
`

const mutation = useMutation(Main_ResetErrorsAndLoadConfigDocument)
const launchProject = useMutation(Main_LaunchProjectDocument)
const localesMutation = useMutation(Main_ResetInitLocalesDocument)

const resetErrorAndLoadConfig = (id: string) => {
  if (!mutation.fetching.value) {
    mutation.executeMutation({ id })
  }
}
const query = useQuery({ query: MainLaunchpadQueryDocument })
const currentProject = computed(() => query.data.value?.currentProject)

function handleClearLandingPage () {
  setMajorVersionWelcomeDismissed(MAJOR_VERSION_FOR_CONTENT)
  const wasBrowserSetInCLI = query.data?.value?.localSettings.preferences?.wasBrowserSetInCLI

  const currentTestingType = currentProject.value?.currentTestingType

  if (wasBrowserSetInCLI && currentTestingType) {
    launchProject.executeMutation({ testingType: currentTestingType })
  }
}

const shouldShowWelcome = computed(() => {
  if (query.data.value) {
    const hasThisVersionBeenSeen = query.data.value?.localSettings?.preferences?.majorVersionWelcomeDismissed?.[MAJOR_VERSION_FOR_CONTENT]
    const wasBrowserSetInCLI = query.data?.value?.localSettings.preferences?.wasBrowserSetInCLI
    const currentTestingType = currentProject.value?.currentTestingType

    const activeBrowser = currentProject.value?.activeBrowser

    const needsActiveBrowser = wasBrowserSetInCLI && currentTestingType

    // if Cypress opened with --browser and --testingType flags,
    // the next step is project launch, so we don't show welcome until browser is ready
    if (needsActiveBrowser) {
      return !hasThisVersionBeenSeen && activeBrowser
    }

    return !hasThisVersionBeenSeen
  }

  return false
})

const videoHtml = computed(() => query.data.value?.videoEmbedHtml || '')

const localeFilters = computed(() => {
  let currentCheckedLocales: string[] = []
  const queryInitLocales = query.data.value?.currentProject?.initLocales

  if (queryInitLocales) {
    currentCheckedLocales = queryInitLocales.split(' ')
  }

  return Object.keys(LOCALE_DATA).map((locale) => {
    return {
      value: locale,
      label: LOCALE_DATA[locale].language,
      checked: currentCheckedLocales.indexOf(locale) !== -1,
    }
  })
})

const handleChange = (e) => {
  const _initLocales = query.data.value?.currentProject?.initLocales?.split(' ') as Locale[]

  if (e.target.checked) {
    _initLocales.push(e.target.value)
    localesMutation.executeMutation({ initLocales: _initLocales.join(' ') }).then(() => {
      toast.success(`Add ${LOCALE_DATA[e.target.value].language} ${e.target.value}`, { timeout: 1500 })
    })
  } else {
    _initLocales.splice(_initLocales.indexOf(e.target.value), 1)
    localesMutation.executeMutation({ initLocales: _initLocales.join(' ') }).then(() => {
      toast.warning(`Delete ${LOCALE_DATA[e.target.value].language} ${e.target.value}`, { timeout: 1500 })
    })
  }
}

</script>
<style scoped lang="scss">
.major-version-welcome-video {
  aspect-ratio: 15/9;
}
</style>
