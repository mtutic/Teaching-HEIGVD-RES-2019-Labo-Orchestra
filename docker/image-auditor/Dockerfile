FROM node:8
MAINTAINER Mateo Tutic <mateo.tutic@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

CMD ["node", "/opt/app/auditor.js"]