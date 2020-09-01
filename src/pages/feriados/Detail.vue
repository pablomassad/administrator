<template>
  <div>
    <q-input
      filled
      v-model="localGroupName"
      label="Nombre del grupo"
      :rules="[val => !!val || 'El nombre del grupo es obligatorio!']"
      @blur="validateChange"
    >
      <template v-slot:append>
        <q-icon
          v-if="localGroupName !== ''"
          name="clear"
          class="cursor-pointer"
          @click="localGroupName = ''"
        />
        <q-chip icon="event" text-color="white" color="primary"
          >Total: {{ detailInfo.length }}</q-chip
        >
      </template>
    </q-input>
    <q-table
      v-if="detailInfo"
      :data="detailInfo"
      :columns="columns"
      row-key="fecha"
      binary-state-sort
      hide-bottom
      :pagination="{
        rowsPerPage: 100
      }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="fecha" :props="props">
            {{ props.row.fecha }}
            <q-popup-edit v-model="props.row.fecha" buttons>
              <q-date v-model="props.row.fecha" :locale="myLocale" />
            </q-popup-edit>
          </q-td>
          <q-td key="descripcion" :props="props">
            {{ props.row.descripcion }}
            <q-popup-edit v-model="props.row.descripcion">
              <q-input
                v-model="props.row.descripcion"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              color="negative"
              icon-right="delete"
              no-caps
              flat
              dense
              @click="deleteval(detailInfo.indexOf(props.row))"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        vertical-actions-align="right"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          color="secondary"
          glossy
          @click="newHoliday = true"
          icon="add_alarm"
        >
          <q-tooltip
            :delay="1000"
            anchor="center left"
            self="center right"
            transition-show="scale"
            transition-hide="scale"
            :offset="[10, 10]"
          >
            <div class="tt">Agregar Feriado</div></q-tooltip
          >
        </q-fab-action>
        <q-fab-action
          color="orange"
          glossy
          @click="cloneHoliday"
          icon="content_copy"
        >
          <q-tooltip
            :delay="1000"
            anchor="center left"
            self="center right"
            transition-show="rotate"
            transition-hide="rotate"
            :offset="[10, 10]"
          >
            <div class="tt">Clonar grupo</div></q-tooltip
          >
        </q-fab-action>
        <q-fab-action
          color="red"
          glossy
          @click="deleteGroup"
          icon="delete_forever"
        >
          <q-tooltip
            :delay="1000"
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
          >
            <div class="tt">Eliminar grupo completo</div></q-tooltip
          >
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="newHoliday">
      <q-card class="my-card">
        <q-card-section>
          <q-date v-model="holiday.fecha" :locale="myLocale" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input filled v-model="holiday.descripcion" label="Descripción">
            <template v-slot:append>
              <q-icon
                v-if="holiday.descripcion !== ''"
                name="event"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            label="Agregar"
            @click="addHoliday"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// Cuando arranca toma el valor de selectedGroupName del STATE
// con ese valor obtiene los hijos del grupo y les da formato localmente
// import { mapState } from 'vuex';

export default {
  data() {
    return {
      myLocale: {
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
          '_'
        ),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split(
          '_'
        ),
        firstDayOfWeek: 1
      },
      columns: [
        {
          name: 'fecha',
          required: true,
          label: 'Fecha',
          align: 'left',
          field: row => row.fecha,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'descripcion',
          required: true,
          label: 'Descripcion',
          align: 'left',
          field: row => row.descripcion,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'action', align: 'left', label: 'Eliminar', field: 'action' }
      ],
      holiday: {
        fecha: '2020/08/14',
        descripcion: ''
      },
      newHoliday: false,
      localGroupName: ''
      // groups: [
      //   {
      //     name: 'Default',
      //     details: [
      //       {
      //         fecha: '2019/03/15',
      //         descripcion: 'Dia de la bandera'
      //       },
      //       {
      //         fecha: '2020/03/15',
      //         descripcion: 'Dia de la Memoria'
      //       },
      //     ]
      //   },
      //   {
      //     name: 'Primer Grupo',
      //     details: [
      //       {
      //         fecha: '2019/03/15',
      //         descripcion: 'Dia de la raza'
      //       }
      //     ]
      //   }
      // ]
    };
  },
  created() {
    console.log('detail created event!');
  },
  mounted() {
    this.localGroupName = this.$store.state.feriados.selectedGroupName;
  },
  computed: {
    // localGroupName: {
    //   get() {
    //     console.log(
    //       'detail selectedGroupName:',
    //       this.$store.state.feriados.selectedGroupName
    //     );
    //     return this.$store.state.feriados.selectedGroupName;
    //   },
    //   set(value) {
    //     this.$store.commit('feriados/setSelectedGroupName', value);
    //   }
    // },
    detailInfo() {
      const detInfo = this.getDetailInfo();
      console.log('detail detailInfo: ', detInfo);
      this.loadSelectedGroupName();
      return detInfo;
    }
    // ...mapState('feriados', ['selectedGroupName'])
    // ...mapState('feriados', ['temporal']),
  },
  methods: {
    validateChange() {
      if (
        this.localGroupName !== this.$store.state.feriados.selectedGroupName
      ) {
        this.$q
          .dialog({
            title: 'Atención',
            message: 'Desea guardar el cambio de nombre de grupo?',
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            try {
              this.$store.commit(
                'feriados/setSelectedGroupName',
                this.localGroupName
              );
            } catch (error) {
              console.log(error);
            }
          })
          .onOk(() => {
            console.log('>>>> second OK catcher');
          })
          .onCancel(() => {
            console.log('>>>> Cancel');
          })
          .onDismiss(() => {
            console.log('I am triggered on both OK and Cancel');
          });
      }
    },
    loadSelectedGroupName() {
      this.localGroupName = this.$store.state.feriados.selectedGroupName;
    },
    getDetailInfo() {
      const found = this.$store.state.feriados.groups.find(x => {
        const res = x.name === this.$store.state.feriados.selectedGroupName;
        return res;
      });
      console.log('detail found:', found);
      return found ? found.details : null;
    },
    deleteval(index) {
      console.log('deleteval:', index);
      this.$q
        .dialog({
          title: 'Atención',
          message: 'Desea eliminar el feriado?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            this.detailInfo.splice(index, 1);
          } catch (error) {
            console.log(error);
          }
        })
        .onOk(() => {
          console.log('>>>> second OK catcher');
        })
        .onCancel(() => {
          console.log('>>>> Cancel');
        })
        .onDismiss(() => {
          console.log('I am triggered on both OK and Cancel');
        });
    },
    addHoliday() {
      this.detailInfo.unshift(this.holiday);
      this.holiday = {
        fecha: '2020/08/14',
        descripcion: ''
      };
      console.log('detailInfo:', this.detailInfo);
    },
    cloneHoliday() {
      this.$q
        .dialog({
          title: 'Atención',
          message: 'Desea clonar el grupo entero?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
          } catch (error) {
            console.log(error);
          }
        })
        .onOk(() => {
          console.log('>>>> second OK catcher');
        })
        .onCancel(() => {
          console.log('>>>> Cancel');
        })
        .onDismiss(() => {
          console.log('I am triggered on both OK and Cancel');
        });
    },
    deleteGroup() {
      this.$q
        .dialog({
          title: 'Atención',
          message: 'Desea eliminar el grupo entero?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
          } catch (error) {
            console.log(error);
          }
        })
        .onOk(() => {
          console.log('>>>> second OK catcher');
        })
        .onCancel(() => {
          console.log('>>>> Cancel');
        })
        .onDismiss(() => {
          console.log('I am triggered on both OK and Cancel');
        });
    }
  },
  beforeDestroy() {
    console.log('before destroy!!!!!!!!!');
  }
};
</script>

<style scoped>
.tt {
  font-size: 14px;
}
</style>
