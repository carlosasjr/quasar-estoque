<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title v-if="brand.name"> {{ brand.name }} </q-toolbar-title>
        <q-toolbar-title v-else> My Store </q-toolbar-title>

        <dark-mode-toggle />

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label @click="handleLogout">Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import useApi from "src/composables/UserApi";
import DarkModeToggle from "src/components/DarkModeToggle.vue";

const linksList = [
  {
    title: "Home",
    icon: "home",
    to: "me",
  },
  {
    title: "Category",
    icon: "category",
    to: "category",
  },
  {
    title: "Product",
    icon: "store",
    to: "product",
  },

  {
    title: "Config",
    icon: "mdi-cog",
    to: "form-config",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    DarkModeToggle,
  },

  setup() {
    const { logout } = useAuthUser();
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const { getBrand, brand } = useApi();

    onMounted(() => {
      getBrand();
    });

    const handleLogout = async () => {
      $q.dialog({
        title: "Logout",
        message: "Do you really want to leave?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout();
        router.replace({ name: "login" });
      });
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
      brand,
    };
  },
});
</script>
