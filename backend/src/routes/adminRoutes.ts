import { Router } from 'express';
import db from '../config/database';
import { checkAdmin } from '../middlewares/checkAdmin';
import { getAllProposals } from '../services/voteService';

const router = Router();

router.get("/admin-test", checkAdmin, (req, res) => {
    return res.json({ isAdmin: true });
});

router.get("/admin/proposals", checkAdmin, async (req, res) => {  
    try {
        const votes = await getAllProposals();
        // Transform Vote[] to Proposal[]
        const proposals = votes.map(vote => ({
          ID: vote.ID,
          school: vote.school,
          name: vote.name,
          logo: vote.logo,
          votes: vote.votes,
          group: vote.group
        }));
        res.json(proposals);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
});

router.post("/admin/setproposals", (req, res) => {
  db.query(`INSERT INTO \`votos\` (\`school\`, \`name\`, \`logo\`, \`group\`) VALUES
('EEE N° 501 LINCOLN- SAFI CICLO BÁSICO','EL PODER DEL ABRAZO','',1),
('EEE N°502 ROBERTS – SAFI','LO ESENCIAL','',1),
('E. DE ARTISTICA – TALLER ADOLESCENTES I','HUBIERA SIDO UN CRIMEN PERFECTO','',1),
('ET N°2- 4° INFORMATICA','NO ES TU CULPA','',1),
('ES N°9 - 4° ARVIS','OMNIBUS','',1),
('ES N°22 - 4° I COM','EL SOLITARIO','',1),
('UNNOBA - 3°','LA LLUVIA SABE PORQUE…','',1),
('UNNOBA - 4° Y 5°','ALICIA EN EL PAIS DE LAS PESADILLAS','',1),
('COLEGIO PADRE RESPUELA - 3°','HOLA BELLA','',1),
('COLEGIO SAN IGNACIO - 1° B','HISTORIAS CRUZADAS','',1),
('COLEGIO SANTA UNIÓN - 3° B I','EL REFLEJO DE PALOMA','',1),
('COLEGIO SANTA UNION – 3° B II','NO ESTAS SOLO','',1),
('ES N°14 - 4° TURISMO','CENICIENTA','',1),

('J.I N°906- 2° SECCIÓN','UN LUGAR PARA CRECER','static/images/un-lugar-para-crecer.png',2),
('J.I N°907- 3° SECCIÓN','DONDE ESTA MI VOZ','static/images/donde-esta-mi-voz.png',2),
('J.I N°910- 3° SECCIÓN','ERASE UNA VEZ, OTRA VEZ Y UNA VEZ MÁS','static/images/erase-una-vez.png',2),
('J.I N°912- 3° SECCIÓN','EL CASTILLO DE LA BRUJA DESORDENADA','static/images/el-castillo-de-la-bruja-desordenada.png',2),
('J.I N°920- 3° SECCIÓN','¿POR QUÉ LOS ELEFANTES PREFIEREN JUGAR A BAILAR?','static/images/por-que-los-elefantes-prefieren-jugar.png',2),
('EEE N°501- 1° Y 2° CICLO','ENCUENTROS','static/images/encuentros.png',2),
('EEE N°502- 1° y 2° CICLO','EL SEÑOR G','static/images/el-señor-g.png',2),
('EEE N°503- 1° y 2° CICLO','LA LEYENDA DE COQUENA','static/images/la-leyenda-del-coquena.png',2),
('EP N°22- 2°','UN LOBO NO TAN FEROZ','static/images/el-lobo-no-tan-feroz.png',2),
('EP N°30- 2°','RICITOS EN UNA NUEVA AVENTURA','static/images/ricitos-de-oro-una-nueva-aventura.png',2),
('EP N°40- 3°','NUESTRA SILLA DE IMAGINAR','static/images/nuestra-silla-de-imaginar.png',2),
('EP N°41- 3°','LA BELLA Y LA BESTIA','static/images/la-bella-y-la-bestia.png',2),
('EP N°47- 1° Y 2°','LAS CAPERUCITAS','static/images/las-caperucitas.png',2),

('EP N°2 VIAMONTE- 5°','AVENTURAS EN EL BOSQUE','',3),
('EP N°3 - 3°, 4° Y 5°','LOS TRES CHANCHITOS','',3),
('EP N°19 - 5°','MARIPOSAS','',3),
('EP N°21- 6°','DEBE SER CONTADO','',3),
('EP N°22- 5°','AMIGOS POR EL VIENTO','',3),
('EP N°48- 6°','EL POZO','',3),
('EP N°49 4°','ReNacer','',3),
('CASITA DEL SABER (GRUPO DE TEATRO)','EL LOBO ARREPENTIDO','',3),

('ES N°7 - 5° III COM','DESHABITADO','',4),
('ES N° 7 - 5° NAT','SUEÑOS EN OFFSIDE','',4),
('ES N°9- 5° ARVIS I','INSOMNIA','',4),
('ES N° 9 – 5° ARVIS II','LA PUERTA AZUL','',4),
('ES N° 9 - 5° I NAT','NO ABRAS LA ÚLTIMA PUERTA','',4),
('ES N°20- 5°','CANELONES','',4),
('ES N°22- 5° I COM','INFANCIAS ROBADAS','',4),
('COLEGIO SANTA UNIÓN- 5° ECO I','VITACORA DE UN RETORNO A ITACA','',4),
('COLEGIO SANTA UNION – 5° ECO II','FRAGMENTOS DE MI','',4),
('COLEGIO SANTA UNION – 5° ECO III','BLANCA, UNA CHICA ATRAPADA','',4),
('ES N°19 5° ARVIS','CASA TOMADA','',4),

('ES N°9 - 6° ARVIS I','ALICIA','',5),
('ES N° 9 – 6° ARVIS II','AMOR','',5),
('ES N° 9 – 6° ARVIS III','LA SOMBRA DE UN ENGAÑO','',5),
('ES N° 9 – 6° ARVIS IV','UN CORTO DE AMOR DE MAYO','',5),
('ES N° 9 - 6° II SOC','LA NONA','',5),
('ES N°10 - 6° EFI','BOCA ARRIBA','',5),
('ES N°12- 6° COM','ESPERANDO LA DAX','',5),
('ES N°18- 6° II','REDES PELIGROSAS','',5),
('ES N°11- 6° EFI','EL BOSQUE NO OLVIDA','',5),
('E. DE ARTISTICA- TALLER DE ADOLESCENTES II','CROMAÑON EN MEMORIA','',5),
('E. DE ARTISTICA - TALLER DE ADULTOS.','EN FAMILIA','',5);
`, (error, results) => {
    if (error) {
      console.error("Error inserting proposals:", error);
      return res.status(500).json({ error: "Error inserting proposals" });
    }
    res.json({ message: "Proposals inserted successfully", results });
});
});

export default router;