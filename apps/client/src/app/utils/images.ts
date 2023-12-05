import sc from '../../assets/images/sc.png';

// Zerg
import bane from '../../assets/images/units/bane.png';
import brood from '../../assets/images/units/brood.png';
import corruptor from '../../assets/images/units/corruptor.png';
import hydra from '../../assets/images/units/hydra.png';
import infestor from '../../assets/images/units/infestor.png';
import lurker from '../../assets/images/units/lurker.png';
import muta from '../../assets/images/units/muta.png';
import ravager from '../../assets/images/units/ravager.png';
import roach from '../../assets/images/units/roach.png';
import swarm from '../../assets/images/units/swarm.png';
import ultra from '../../assets/images/units/ultra.png';
import viper from '../../assets/images/units/viper.png';
import zergling from '../../assets/images/units/zergling.png';

// Terran
import marine from '../../assets/images/units/marine.png';
import hellion from '../../assets/images/units/hellion.png';
import marauder from '../../assets/images/units/marauder.png';
import reaper from '../../assets/images/units/reaper.png';
import widowMine from '../../assets/images/units/widow_mine.png';
import viking from '../../assets/images/units/viking.png';
import banshee from '../../assets/images/units/banshee.png';
import ghost from '../../assets/images/units/ghost.png';
import siegeTank from '../../assets/images/units/siege_tank.png';
import cyclone from '../../assets/images/units/cyclone.png';
import liberator from '../../assets/images/units/liberator.png';
import thor from '../../assets/images/units/thor.png';
import raven from '../../assets/images/units/raven.png';
import battlecruiser from '../../assets/images/units/battlecruiser.png';
// Add more Terran unit imports as needed

// Protoss
import zealot from '../../assets/images/units/zealot.png';
import adept from '../../assets/images/units/adept.png';
import stalker from '../../assets/images/units/stalker.png';
import sentry from '../../assets/images/units/sentry.png';
import immortal from '../../assets/images/units/immortal.png';
import phoenix from '../../assets/images/units/phoenix.png';
import highTemplar from '../../assets/images/units/high_templar.png';
import darkTemplar from '../../assets/images/units/dark_templar.png';
import voidRay from '../../assets/images/units/void_ray.png';
import oracle from '../../assets/images/units/oracle.png';
import tempest from '../../assets/images/units/tempest.png';
import colossus from '../../assets/images/units/colossus.png';
import archon from '../../assets/images/units/archon.png';
import carrier from '../../assets/images/units/carrier.png';
import disruptor from '../../assets/images/units/disruptor.png';

export function getUnitImage(unit: string): string {
  switch (unit) {
    // Zerg units
    case 'zergling':
      return zergling;
    case 'baneling':
      return bane;
    case 'roach':
      return roach;
    case 'hydra':
      return hydra;
    case 'swarm_host':
      return swarm;
    case 'ravager':
      return ravager;
    case 'mutalisk':
      return muta;
    case 'corruptor':
      return corruptor;
    case 'lurker':
      return lurker;
    case 'infestor':
      return infestor;
    case 'ultralisk':
      return ultra;
    case 'viper':
      return viper;
    case 'broodlord':
      return brood;

    // Terran units
    case 'marine':
      return marine;
    case 'hellion':
      return hellion;
    case 'marauder':
      return marauder;
    case 'reaper':
      return reaper;
    case 'widow_mine':
      return widowMine;
    case 'viking':
      return viking;
    case 'banshee':
      return banshee;
    case 'ghost':
      return ghost;
    case 'siege_tank':
      return siegeTank;
    case 'cyclone':
      return cyclone;
    case 'liberator':
      return liberator;
    case 'thor':
      return thor;
    case 'raven':
      return raven;
    case 'battlecruiser':
      return battlecruiser;

    // Protoss units
    case 'zealot':
      return zealot;
    case 'adept':
      return adept;
    case 'stalker':
      return stalker;
    case 'sentry':
      return sentry;
    case 'immortal':
      return immortal;
    case 'disruptor':
      return disruptor;
    case 'phoenix':
      return phoenix;
    case 'high_templar':
      return highTemplar;
    case 'dark_templar':
      return darkTemplar;
    case 'void_ray':
      return voidRay;
    case 'oracle':
      return oracle;
    case 'tempest':
      return tempest;
    case 'colossus':
      return colossus;
    case 'archon':
      return archon;
    case 'carrier':
      return carrier;
    default:
      return sc;
  }
}
