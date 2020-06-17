<template>
  <v-content>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card :to="$router.options.routes[1].path">
            <p class="subtitle-1 text-center ma-1 pa-7">
              {{$router.options.routes[1].name}}
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card :to="$router.options.routes[2].path">
            <p class="subtitle-1 text-center ma-1 pa-7">
              {{$router.options.routes[2].name}}
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card :to="$router.options.routes[3].path">
            <p class="subtitle-1 text-center ma-1 pa-7">
              {{$router.options.routes[3].name}}
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card :to="$router.options.routes[4].path">
            <p class="subtitle-1 text-center ma-1 pa-7">
              {{$router.options.routes[4].name}}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>    
  </v-content>
</template>